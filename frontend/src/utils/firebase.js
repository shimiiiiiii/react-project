import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
    signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCokZWiwqSD1LIqHm-S8CsqQrpN4W5YTKY",
    authDomain: "reactjsproject-7064a.firebaseapp.com",
    projectId: "reactjsproject-7064a",
    storageBucket: "reactjsproject-7064a.firebasestorage.app",
    messagingSenderId: "464783054486",
    appId: "1:464783054486:web:b5ce3d98a9d52bfaf514b7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signInWithPopup, GoogleAuthProvider, FacebookAuthProvider,
 };
