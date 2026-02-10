import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    setDoc,
    getDoc,
    query,
    where,
    orderBy,
    Timestamp,
    DocumentData,
    QueryDocumentSnapshot
} from "firebase/firestore";
import { db } from "./firebase";
import { Complaint, Announcement, ComplaintStatus, HouseDetails } from "@/types";
import { formatUnitId } from "@/constants/residential";

// Helper to generate unit ID string
export const getUnitId = (house: HouseDetails | string) => {
    if (!house) return '';
    if (typeof house === 'string') return house;
    return formatUnitId(house.block, house.floor, house.houseNo);
};

// Helper to convert Firestore doc to our interface
const convertDoc = <T>(snapshot: QueryDocumentSnapshot<DocumentData>): T => {
    return {
        id: snapshot.id,
        ...snapshot.data()
    } as T;
};

// --- Complaints CRUD ---

export const createComplaint = async (complaintData: Omit<Complaint, 'id'>) => {
    const docRef = await addDoc(collection(db, "complaints"), {
        ...complaintData,
        dateSubmitted: new Date().toISOString()
    });
    return docRef.id;
};

export const getComplaints = async (filters?: { status?: ComplaintStatus; creatorId?: string }) => {
    let q = query(collection(db, "complaints"), orderBy("dateSubmitted", "desc"));

    if (filters?.status) {
        q = query(q, where("status", "==", filters.status));
    }

    if (filters?.creatorId) {
        q = query(q, where("creator.id", "==", filters.creatorId));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => convertDoc<Complaint>(doc));
};

export const updateComplaint = async (id: string, updates: Partial<Complaint>) => {
    const docRef = doc(db, "complaints", id);
    await updateDoc(docRef, updates);
};

export const deleteComplaint = async (id: string) => {
    const docRef = doc(db, "complaints", id);
    await deleteDoc(docRef);
};

// --- Announcements CRUD ---

export const createAnnouncement = async (announcementData: Omit<Announcement, 'id'>) => {
    const docRef = await addDoc(collection(db, "announcements"), {
        ...announcementData,
        createdAt: new Date().toISOString()
    });
    return docRef.id;
};

export const getAnnouncements = async () => {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => convertDoc<Announcement>(doc));
};

export const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    const docRef = doc(db, "announcements", id);
    await updateDoc(docRef, updates);
};

export const deleteAnnouncement = async (id: string) => {
    const docRef = doc(db, "announcements", id);
    await deleteDoc(docRef);
};
// --- Residency & Unit Management ---

/**
 * Marks a unit as occupied or available
 */
export const syncUnitOccupancy = async (unitId: string, isOccupied: boolean, residentId: string | null = null) => {
    if (!unitId) return;
    const unitRef = doc(db, "units", unitId);
    await setDoc(unitRef, {
        isOccupied,
        residentId,
        updatedAt: new Date().toISOString()
    }, { merge: true });
};

export const getOccupiedUnits = async (): Promise<string[]> => {
    const q = query(collection(db, "units"), where("isOccupied", "==", true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.id);
};

export const getAllResidents = async () => {
    const q = query(collection(db, "users"), where("role", "==", "resident"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => convertDoc<any>(doc));
};

export const updateUserProfile = async (userId: string, updates: any) => {
    const userRef = doc(db, "users", userId);

    // Check if houseNumber is changing
    const oldDoc = await getDoc(userRef);
    const oldData = oldDoc.data();

    await updateDoc(userRef, updates);

    // If houseNumber changed, sync the units collection
    if (updates.houseNumber) {
        const oldId = oldData?.houseNumber ? getUnitId(oldData.houseNumber) : '';
        const newId = getUnitId(updates.houseNumber);

        if (newId !== oldId) {
            // Free up the old house
            if (oldId) {
                await syncUnitOccupancy(oldId, false);
            }
            // Occupy the new one
            await syncUnitOccupancy(newId, true, userId);
        }
    }
    const updatedDoc = await getDoc(userRef);
    return { id: userId, ...updatedDoc.data() } as any;
};

export const deleteUserAccount = async (userId: string) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.houseNumber) {
            const unitId = getUnitId(userData.houseNumber);
            await syncUnitOccupancy(unitId, false);
        }
    }

    await deleteDoc(userRef);
};
