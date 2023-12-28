import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDrB4397TmoijcNa-kKhBp3FaZpufFed1U',
  authDomain: 'fir-course-e74a6.firebaseapp.com',
  projectId: 'fir-course-e74a6',
  storageBucket: 'fir-course-e74a6.appspot.com',
  messagingSenderId: '320703385096',
  appId: '1:320703385096:web:b7ebb293d8a01b0e85cbbd',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
