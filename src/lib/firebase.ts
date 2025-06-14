import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDTHBWeD-lZf0Qu7lZGKdhVKfCLUmoErL0",
    authDomain: "invest-in-me-878a0.firebaseapp.com",
    projectId: "invest-in-me-878a0",
    storageBucket: "invest-in-me-878a0.firebasestorage.app",
    messagingSenderId: "705332091196",
    appId: "1:705332091196:web:909f24d4d121030904a639",
    measurementId: "G-4SMLN5PG6B"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export { app };
export const db = getFirestore(app); 