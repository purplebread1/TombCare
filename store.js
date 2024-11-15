import { Store } from "pullstate";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB, FIREBASE_STORAGE } from "./firebaseConfig";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { ref, getDownloadURL, deleteObject } from "firebase/storage";

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
		}
	} catch (error) {
		console.log(error.code);
		alert("Sign in failed: Invalid credentials");
		return false;
	}
	return true;
};

export const signOutUser = async () => {
	try {
		await signOut(FIREBASE_AUTH);
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
