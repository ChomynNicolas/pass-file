import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";



// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDsOz5U2mEO1C_DVfeuM9w1-2tBiAYZalU",
  authDomain: "pass-file-72235.firebaseapp.com",
  projectId: "pass-file-72235",
  storageBucket: "pass-file-72235.appspot.com",
  messagingSenderId: "137131755513",
  appId: "1:137131755513:web:538c857788a4ac58f11f28",
  measurementId: "G-691H5B3CVQ"
};

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);


export {firebase, db}