import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Replace with your Firebase project’s configuration
const firebaseConfig = {
    apiKey: "AIzaSyCokZWiwqSD1LIqHm-S8CsqQrpN4W5YTKY",
    authDomain: "reactjsproject-7064a.firebaseapp.com",
    projectId: "reactjsproject-7064a",
    storageBucket: "reactjsproject-7064a.firebasestorage.app",
    messagingSenderId: "464783054486",
    appId: "1:464783054486:web:b5ce3d98a9d52bfaf514b7"
};

// Initialize Firebase and export authentication functions
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };
