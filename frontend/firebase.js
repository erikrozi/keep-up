// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrS-uc6XqsjuxhFzr-B6ionAi6XKnd2WI",
  authDomain: "keepup-f143d.firebaseapp.com",
  projectId: "keepup-f143d",
  storageBucket: "keepup-f143d.appspot.com",
  messagingSenderId: "434713588482",
  appId: "1:434713588482:web:473723d91026aae401481b",
  measurementId: "G-V6CSVRPPBP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
