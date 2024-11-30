import { Store } from "pullstate";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB, FIREBASE_STORAGE } from "./firebaseConfig";
import {
	doc,
	setDoc,
	getDoc,
	collection,
	query,
	where,
	getDocs,
	Timestamp,
	addDoc,
	orderBy,
	updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, deleteObject } from "firebase/storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as Notifications from "expo-notifications";

export const UserStore = new Store({
	id: "",
	firstName: "",
	lastName: "",
	mobileNumber: "",
	email: "",
	address: "",
	profilePic: "",
});

export const signUp = async (user) => {
	try {
		const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, user.email, user.password);
		const userRef = collection(FIRESTORE_DB, "users");
		const userDocRef = doc(userRef, response.user.uid);
		await setDoc(userDocRef, {
			uid: response.user.uid,
			firstName: user.firstName,
			lastName: user.lastName,
			mobileNumber: user.mobileNumber,
			email: user.email,
			password: user.password,
			profilePic: "",
			address: user.address,
		});

		return response.user.uid;
	} catch (error) {
		console.log(error);
		alert("Sign up failed!");
	}
};

export const signIn = async (email, password) => {
	try {
		const response = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
		const userId = response.user.uid;

		// Fetch user data
		const userDocRef = doc(FIRESTORE_DB, "users", userId);
		const userDoc = await getDoc(userDocRef);

		if (userDoc.exists()) {
			const userData = userDoc.data();
			UserStore.update((s) => {
				s.id = userId;
				s.firstName = userData.firstName;
				s.lastName = userData.lastName;
				s.email = userData.email;
				s.mobileNumber = userData.mobileNumber;
				s.address = userData.address;
				s.profilePic = userData.profilePic;
			});
		} else {
			console.log("User does not exist!");
			throw new Error();
		}
	} catch (error) {
		console.log(error.code);
		alert("Sign in failed: Invalid credentials");
		return false;
	}
	return true;
};

export const googleSignUp = async (uid, user) => {
	try {
		const userRef = doc(FIRESTORE_DB, "users", uid); // DocumentReference for searching
		const userDocRef = doc(collection(FIRESTORE_DB, "users"), uid); // Create a DocumentReference using the user's UID if new
		const docSnapshot = await getDoc(userRef);
		if (!docSnapshot.exists()) {
			await setDoc(userDocRef, {
				uid: uid,
				firstName: user.givenName,
				lastName: user.familyName,
				mobileNumber: "",
				email: user.email,
				profilePic: user.photo,
				address: "",
			});
			UserStore.update((s) => {
				s.id = uid;
				s.firstName = user.givenNam;
				s.lastName = user.familyName;
				s.email = user.email;
				s.mobileNumber = "";
				s.address = "";
				s.profilePic = user.photo;
			});
			return true; // if new user
		} else {
			const userData = docSnapshot.data();
			UserStore.update((s) => {
				s.id = uid;
				s.firstName = userData.firstName;
				s.lastName = userData.lastName;
				s.email = userData.email;
				s.mobileNumber = userData.mobileNumber;
				s.address = userData.address;
				s.profilePic = userData.profilePic;
			});
		}
		return false;
	} catch (error) {
		console.log(error);
		alert("Sign up failed!");
	}
};

export const signOutUser = async () => {
	try {
		await signOut(FIREBASE_AUTH);
		GoogleSignin.revokeAccess();
		GoogleSignin.signOut();
		UserStore.update((s) => {
			s.id = "";
			s.firstName = "";
			s.lastName = "";
			s.email = "";
			s.mobileNumber = "";
			s.address = "";
			s.profilePic = "s";
		});
	} catch (error) {
		console.log(error);
	}
};

export const updateUser = async (user) => {
	try {
		const userDocRef = doc(FIRESTORE_DB, "users", user.id);
		await setDoc(
			userDocRef,
			{
				firstName: user.firstName,
				lastName: user.lastName,
				mobileNumber: user.mobileNumber,
				address: user.address,
				profilePic: user.profilePic,
			},
			{ merge: true }
		);

		UserStore.update((s) => {
			s.firstName = user.firstName;
			s.lastName = user.lastName;
			s.mobileNumber = user.mobileNumber;
			s.address = user.address;
			s.profilePic = user.profilePic;
		});
	} catch (error) {
		console.log(error);
		alert("Update failed!");
	}
};

export const updatePaid = async (orderID) => {
	try {
		const orderRef = doc(FIRESTORE_DB, "transactions", orderID);
		await updateDoc(orderRef, {
			paid: true,
		});

		console.log("Order marked as paid successfully!");
	} catch (error) {
		console.error("Error updating payment status:", error);
	}
};

export const fetchServices = async (type) => {
	try {
		const servicesRef = collection(FIRESTORE_DB, "service");
		const q = query(servicesRef, where("serviceType", "==", type));
		const querySnapshot = await getDocs(q);
		const services = [];
		querySnapshot.forEach((doc) => {
			services.push({ id: doc.id, ...doc.data() });
		});
		return services;
	} catch (error) {
		console.log(error);
		alert("Failed to fetch services!");
		return [];
	}
};

export const addTransaction = async (data) => {
	const token = await getExpoPushToken();
	try {
		const transactionRef = collection(FIRESTORE_DB, "transactions");
		const newTransactionRef = doc(transactionRef); // Generate a new document ID
		await setDoc(newTransactionRef, {
			...data,
			created: Timestamp.now(),
			expoPushToken: token,
		});

		return true; // Return the transaction ID
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const addRecord = async (data) => {
	try {
		const recordsRef = collection(FIRESTORE_DB, "records");
		const docRef = await addDoc(recordsRef, {
			...data,
			dateOfBirth: Timestamp.fromDate(new Date(data.dateOfBirth)),
			dateOfBurial: Timestamp.fromDate(new Date(data.dateOfBurial)),
			dateOfDeath: Timestamp.fromDate(new Date(data.dateOfDeath)),
			created: Timestamp.now(),
		});
		console.log("Record added with ID:", docRef.id);
		return docRef.id; // Return the document ID
	} catch (error) {
		console.error("Error adding record:", error);
		return null;
	}
};

export const fetchRecords = async () => {
	try {
		const recordsRef = collection(FIRESTORE_DB, "records");
		const q = query(recordsRef, where("approved", "==", true));
		const querySnapshot = await getDocs(q);
		const records = [];
		querySnapshot.forEach((doc) => {
			records.push({ id: doc.id, ...doc.data() });
		});
		return records;
	} catch (error) {
		console.log(error);
		alert("Failed to fetch records!");
		return [];
	}
};

const getExpoPushToken = async () => {
	const projectId = "56c065fb-491e-495d-a8a7-5b1c22cf3288";

	try {
		const pushTokenString = (
			await Notifications.getExpoPushTokenAsync({
				projectId,
			})
		).data;
		return pushTokenString;
	} catch (error) {
		console.log(error);
	}
	return null;
};
