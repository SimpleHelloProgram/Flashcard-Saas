// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_bEblUY53XnkSEW4RPDjmJCniMG7vjto",
  authDomain: "flashcardsaas-d5605.firebaseapp.com",
  projectId: "flashcardsaas-d5605",
  storageBucket: "flashcardsaas-d5605.appspot.com",
  messagingSenderId: "315402735209",
  appId: "1:315402735209:web:1b140680b910b086a89cf8",
  measurementId: "G-P5T68N7058"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db}