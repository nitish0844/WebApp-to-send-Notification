import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {getFirestore} from "@firebase/firestore"

// Replace the following with your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA36jnTt-U0SXl8q8_Rodbe2LrgYGYYO-g",
  authDomain: "platform2learn-54f87.firebaseapp.com",
  databaseURL:
    "https://platform2learn-54f87-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "platform2learn-54f87",
  storageBucket: "platform2learn-54f87.appspot.com",
  messagingSenderId: "163118202949",
  appId: "1:163118202949:web:7ad220c469f9212f21232c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const Storage_Bucket = getStorage(app);
export const db  = getFirestore(app)
