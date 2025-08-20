// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence } from 'firebase/auth';
import {
  getAnalytics,
  setAnalyticsCollectionEnabled,
} from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBkuFw4YLzftL0bOyE-6OQKn7tu8QP-aAY',
  authDomain: 'course-work-91588.firebaseapp.com',
  projectId: 'course-work-91588',
  storageBucket: 'course-work-91588.firebasestorage.app',
  messagingSenderId: '805694174237',
  appId: '1:805694174237:web:50d3bf250dcffcf5e982f4',
  measurementId: 'G-YTY5P4ZTCK',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const db = getFirestore(app);
export const analytics = getAnalytics(app);
setAnalyticsCollectionEnabled(analytics, true);

export default app;
