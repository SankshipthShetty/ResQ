import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence, signInWithEmailAndPassword as signIn, createUserWithEmailAndPassword as createUser, GoogleAuthProvider } from "firebase/auth/";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  appId: process.env.APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});const firestore = getFirestore(app); // Initialize Firestore

const storage = getStorage(app);

export { app, auth, firestore,signIn, createUser ,GoogleAuthProvider,storage};
