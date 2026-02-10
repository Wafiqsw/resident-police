import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { ResidentProfile, CommitteeMember, User } from "@/types";
import { syncUnitOccupancy, getUnitId, updateUserProfile as firestoreUpdateUserProfile } from "./firestore";

/**
 * Register a new resident and create their profile in Firestore
 */
export const registerResident = async (profile: ResidentProfile, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, profile.email, password);
    const user = userCredential.user;

    // Create the profile in Firestore
    const residentData: ResidentProfile = {
        ...profile,
        id: user.uid,
        role: 'resident'
    };

    await setDoc(doc(db, "users", user.uid), residentData);

    // Sync residency with units collection
    if (profile.houseNumber) {
        await syncUnitOccupancy(getUnitId(profile.houseNumber), true, user.uid);
    }

    return residentData;
};

/**
 * Register a new committee member and create their profile in Firestore
 */
export const registerCommittee = async (profile: CommitteeMember, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, profile.email, password);
    const user = userCredential.user;

    // Create the profile in Firestore
    const committeeData: CommitteeMember = {
        ...profile,
        id: user.uid,
        role: 'committee'
    };

    await setDoc(doc(db, "users", user.uid), committeeData);
    return committeeData;
};

/**
 * Sign in a user and fetch their profile from Firestore
 */
export const signIn = async (email: string, password: string): Promise<{ user: FirebaseUser; profile: User }> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const docSnap = await getDoc(doc(db, "users", user.uid));
    if (!docSnap.exists()) {
        throw new Error("User profile not found in database.");
    }

    return {
        user,
        profile: docSnap.data() as User
    };
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
    await firebaseSignOut(auth);
};

/**
 * Get the current user's profile
 */
export const getUserProfile = async (uid: string): Promise<User | null> => {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
        return docSnap.data() as User;
    }
    return null;
};

/**
 * Update user profile in Firestore
 */
export const updateUserProfile = firestoreUpdateUserProfile;

/**
 * Change user password
 */
export const changePassword = async (currentPassword: string, newPassword: string) => {
    const user = auth.currentUser;
    if (!user || !user.email) {
        throw new Error("No user is currently logged in");
    }

    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);
};

