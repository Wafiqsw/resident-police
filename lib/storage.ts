import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
};

export const uploadBase64Image = async (base64String: string, path: string): Promise<string> => {
    // Convert base64 to Blob
    const response = await fetch(base64String);
    const blob = await response.blob();

    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, blob);
    return await getDownloadURL(snapshot.ref);
};

export const deleteFile = async (url: string) => {
    if (!url || !url.includes('firebasestorage.googleapis.com')) return;
    try {
        const fileRef = ref(storage, url);
        await deleteObject(fileRef);
    } catch (error) {
        console.error("Error deleting file from storage:", error);
    }
};
