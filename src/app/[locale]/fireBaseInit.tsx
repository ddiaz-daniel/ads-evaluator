'use client';
import React, { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

interface PagesProps {
  children: React.ReactNode;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, firestore, storage };

const FirebaseInit: React.FC<PagesProps> = ({ children }) => {
  useEffect(() => {
    initializeApp(firebaseConfig);
    getAnalytics(app);
    getFirestore(app);
  }, []);

  return <>{children}</>;
};

export default FirebaseInit;
