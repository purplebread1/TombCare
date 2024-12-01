import { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { COLORS } from "../../../../constants/Colors";
import { Link, router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { UserStore, updateUser } from "../../../../store";
import { useStoreState } from "pullstate";
import Loading from "../../../../components/loading";
import * as ImagePicker from "expo-image-picker";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { FIREBASE_STORAGE } from "../../../../firebaseConfig";

const EditProfile = () => {
	const USER = useStoreState(UserStore);
	const DEFAULT_PROFILE_PIC = require("../../../../assets/images/default-profile-pic.jpg");

	const [user, setUser] = useState(USER);
	const [loading, setLoading] = useState(false);
	const [image, setImage] = useState(null); // Store image URI

	useEffect(() => {
		getPermissions();
	}, []);

	const getPermissions = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			alert("Sorry, we need camera roll permissions to make this work!");
		}
	};

	const handleUpdate = async () => {
		setLoading(true);

		let imageUrl = "";
		// If an image is selected, upload it
		if (image?.uri) {
			try {
				imageUrl = await uploadImage(image?.uri, user.id);
			} catch (error) {
				console.error(error);
				alert("Failed to upload image.");
				setLoading(false);
				return;
			}
		}

		// Update user data
		const data = { ...user };
		if (imageUrl !== "") {
			data.profilePic = imageUrl;
		}
		await updateUser(data);
		alert("Profile updated successfully!");
		setLoading(false);
		router.replace("/profile");
	};

	// Pick image for profile picture
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0]);
		}
	};

	// Upload image to Firebase Storage
	const uploadImage = async (uri, uid) => {
		const blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function (e) {
				console.log(e);
				reject(new TypeError("Network request failed"));
			};
			xhr.responseType = "blob";
			xhr.open("GET", uri, true);
			xhr.send(null);
		});

		if (!blob) {
			throw new Error("Blob conversion failed.");
		}

		const filename = "Profile/" + uid + "-profilePic";
		const storageRef = ref(FIREBASE_STORAGE, filename);

		// const uploadTask = uploadBytesResumable(storageRef, blob);
		await uploadBytes(storageRef, blob);

		// We're done with the blob, close and release it
		blob.close();

		return await getDownloadURL(storageRef);
	};

	return (
		<View style={styles.container}>
			{loading && <Loading />}
			<Image style={styles.eclipse} source={require("../../../../assets/images/eclipse.png")} />
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()} style={{ position: "absolute", left: 10 }}>
					<AntDesign name={"left"} size={24} color="white" />
				</TouchableOpacity>
				<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Edit Profile</Text>
			</View>
			<View style={styles.innerContainer}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "flex-start",
						columnGap: 20,
					}}
				>
					<Image
						source={
							image
								? { uri: image.uri }
								: USER.profilePic
								? { uri: USER.profilePic }
								: DEFAULT_PROFILE_PIC
						}
						style={{ height: 100, width: 100, borderRadius: 100 }}
					/>
					<TouchableOpacity onPress={pickImage} style={styles.button}>
						<Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>Upload Picture</Text>
					</TouchableOpacity>
				</View>
				<View style={{ alignItems: "center" }}>
					<View style={{ flexDirection: "row", columnGap: 10, marginTop: 30 }}>
						<TextInput
							style={[styles.input, { flex: 1 }]}
							placeholder="First Name"
							placeholderTextColor={"black"}
							value={user.firstName}
							onChangeText={(text) => setUser({ ...user, firstName: text })}
						/>
						<TextInput
							style={[styles.input, { flex: 1 }]}
							placeholder="Last Name"
							placeholderTextColor={"black"}
							value={user.lastName}
							onChangeText={(text) => setUser({ ...user, lastName: text })}
						/>
					</View>
					<TextInput
						style={styles.input}
						placeholder="Mobile Number"
						placeholderTextColor={"black"}
						value={user.mobileNumber}
						onChangeText={(text) => {
							if (text.startsWith("09")) {
								setUser({ ...user, mobileNumber: text });
							} else {
								setUser({ ...user, mobileNumber: "09" });
							}
						}}
						keyboardType="number-pad"
						maxLength={11}
					/>
					<TextInput
						style={styles.input}
						placeholder="Address"
						placeholderTextColor={"black"}
						value={user.address}
						onChangeText={(text) => setUser({ ...user, address: text })}
					/>
				</View>
				<View style={{ alignItems: "center" }}>
					<TouchableOpacity
						style={[styles.button, { backgroundColor: COLORS.completed }]}
						onPress={handleUpdate}
					>
						<Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>Update</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default EditProfile;

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLORS.background,
		flex: 1,
	},
	eclipse: {
		position: "absolute",
		top: -30,
		left: -50,
	},
	innerContainer: {
		flex: 1,
		paddingHorizontal: 25,
	},
	header: {
		backgroundColor: "black",
		height: 60,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	button: {
		marginTop: 20,
		alignItems: "center",
		width: 150,
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: COLORS.primary,
		borderRadius: 10,
	},
	input: {
		marginBottom: 15,
		padding: 10,
		backgroundColor: "white",
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 5,
		width: "100%",
	},
});
