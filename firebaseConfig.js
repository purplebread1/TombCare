import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
	getAuth,
	initializeAuth,
	getReactNativePersistence,
	browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
	apiKey: "AIzaSyAtPQYpK9Ad1uB3xTljsdB7ReJO46hMCqQ",
	authDomain: "tombcare-601bc.firebaseapp.com",
	projectId: "tombcare-601bc",
	storageBucket: "tombcare-601bc.firebasestorage.app",
	messagingSenderId: "178689170689",
	appId: "1:178689170689:web:c62227cb4afb529730cf00",
	measurementId: "G-GPQSBNE74F",
};

let persistence;

if (Platform.OS === "web") {
	persistence = browserLocalPersistence;
} else {
	persistence = getReactNativePersistence(AsyncStorage);
}

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
	persistence: persistence,
});
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
export const auth = getAuth(FIREBASE_APP);
