import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface Guest {
  id: string;
  name: string;
  attending: 'yes' | 'no';
  guests: string;
  createdAt: Date;
}

export async function addGuest(data: { name: string; attending: string; guests: string }) {
  const docRef = await addDoc(collection(db, 'guests'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getGuests(): Promise<Guest[]> {
  const snapshot = await getDocs(collection(db, 'guests'));
  return snapshot.docs.map((d) => ({
    id: d.id,
    name: d.data().name,
    attending: d.data().attending,
    guests: d.data().guests,
    createdAt: d.data().createdAt?.toDate() || new Date(),
  }));
}

export async function deleteGuest(id: string) {
  await deleteDoc(doc(db, 'guests', id));
}
