// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6Kqp_FU3_x_O6JSM5E0VWMiBMspOELw0",
  authDomain: "react-auth-929f6.firebaseapp.com",
  projectId: "react-auth-929f6",
  storageBucket: "react-auth-929f6.firebasestorage.app",
  messagingSenderId: "659350480326",
  appId: "1:659350480326:web:de15a5202deffe972abec7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provide = new GoogleAuthProvider()