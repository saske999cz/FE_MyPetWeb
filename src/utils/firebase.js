// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUpFH3N2cKhv1VFzTSmZJNC0O_VKoRoWQ",
  authDomain: "petshop-3d4ae.firebaseapp.com",
  projectId: "petshop-3d4ae",
  storageBucket: "petshop-3d4ae.appspot.com",
  messagingSenderId: "224358929740",
  appId: "1:224358929740:web:d7415b94d29830f25eabe9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore to get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage }