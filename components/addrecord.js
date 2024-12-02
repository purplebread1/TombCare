import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, Modal } from "react-native";
import React, { useState, useEffect } from "react";
import { COLORS } from "../constants/Colors";
import { Link } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CheckBox } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Loading from "../components/loading";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { addRecord, UserStore } from "../store";
import { useStoreState } from "pullstate";

const AddRecord = ({ lotID, openForm, setOpenForm, lotCoordinates }) => {
	const USER = useStoreState(UserStore);
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
	const [activeDateField, setActiveDateField] = useState(null);
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		lotID: lotID,
		tombID: "",
		firstName: "",
		lastName: "",
		middleName: "",
		gender: "Male",
		dateOfBirth: "",
		dateOfDeath: "",
		dateOfBurial: "",
		deathCertificate: "",
		privacy: "Public",
		lotCoordinates: lotCoordinates,
	});

	useEffect(() => {
		getPermissions();
	}, []);

	const getPermissions = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			alert("Sorry, we need camera roll permissions to make this work!");
		}
	};

	// Show the date picker and specify which field to update
	const showDatePicker = (field) => {
		setActiveDateField(field);
		setDatePickerVisibility(true);
	};

	// Hide the date picker
	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	// Pick image for profile picture
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			setFormData((prev) => ({
				...prev,
				deathCertificate: result.assets[0].uri,
			}));
			setImage(result.assets[0]);
		}
	};

	// Handle the selected date
	const handleConfirm = (date) => {
		const formattedDate = date.toISOString().split("T")[0];
		setFormData((prev) => ({
			...prev,
			[activeDateField]: formattedDate,
		}));
		hideDatePicker();
	};

	const handleBackPress = () => {
		setFormData({
			lotID: lotID,
			tombID: "",
			firstName: "",
			lastName: "",
			middleName: "",
			gender: "Male",
			dateOfBirth: "",
			dateOfDeath: "",
			dateOfBurial: "",
			deathCertificate: "",
			privacy: "Public",
		});
		setImage(null);
		setActiveDateField(null);
		setDatePickerVisibility(false);
		setLoading(false);
		setOpenForm(false);
	};

	const uploadImage = async (uri, lastName) => {
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

		const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
		const filename = "Records/" + lastName + uniqueId;
		const storageRef = ref(FIREBASE_STORAGE, filename);

		// const uploadTask = uploadBytesResumable(storageRef, blob);
		await uploadBytes(storageRef, blob);

		// We're done with the blob, close and release it
		blob.close();

		return await getDownloadURL(storageRef);
	};

	const handleAddRecord = async () => {
		// Trim all string fields in formData
		const trimmedFormData = Object.fromEntries(
			Object.entries(formData).map(([key, value]) => [
				key,
				typeof value === "string" ? value.trim() : value,
			])
		);

		console.log(trimmedFormData);

		if (
			Object.entries(trimmedFormData).some(([key, value]) => {
				if (key !== "approved" && key !== "tombID" && key !== "middleName") {
					return value === "" || value == null;
				}
				return false;
			})
		) {
			alert("Please fill out all fields!");
			return;
		}

		setLoading(true);
		let deathCertificateURL = "";
		if (image?.uri) {
			try {
				deathCertificateURL = await uploadImage(image.uri, trimmedFormData.lastName);
			} catch (error) {
				alert("Failed to upload death certificate.");
				console.error(error);
				setLoading(false);
				return;
			}
		}

		// Update record with the uploaded URL
		const updatedRecord = {
			...trimmedFormData,
			deathCertificate: deathCertificateURL,
			registeredBy: USER.id,
		};
		console.log(updatedRecord);

		// Add the burial record and get the record ID
		try {
			await addRecord(updatedRecord);
			alert("Record added successfully!");
			handleBackPress();
		} catch (error) {
			console.error("Error adding record:", error);
			alert("Failed to add record.");
		}
	};

	return (
		<Modal visible={openForm} onRequestClose={handleBackPress} animationType="none">
			{loading && <Loading />}
			<View style={styles.container}>
				<Image style={styles.eclipse} source={require("../assets/images/eclipse.png")} />
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity onPress={handleBackPress} style={{ position: "absolute", left: 10 }}>
						<AntDesign name={"left"} size={24} color="white" />
					</TouchableOpacity>
					<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Add Record</Text>
				</View>
				<KeyboardAwareScrollView
					showVerticalScrollIndicator={false}
					contentContainerStyle={styles.innerContainer}
				>
					<Text style={styles.text}>Enter information of the Deceased</Text>
					<Text style={{ fontWeight: "bold", marginBottom: 5 }}>Lot ID:</Text>
					<TextInput value={lotID} style={styles.input} placeholderTextColor={"gray"} readOnly />
					<TextInput
						style={styles.input}
						placeholder="First Name"
						placeholderTextColor={"gray"}
						onChangeText={(text) => setFormData({ ...formData, firstName: text })}
					/>
					<TextInput
						style={styles.input}
						placeholder="Middle Name"
						placeholderTextColor={"gray"}
						onChangeText={(text) => setFormData({ ...formData, middleName: text })}
					/>
					<TextInput
						style={styles.input}
						placeholder="Last Name"
						placeholderTextColor={"gray"}
						onChangeText={(text) => setFormData({ ...formData, lastName: text })}
					/>
					<Text style={{ fontWeight: "bold" }}>Gender</Text>
					<View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
						<CheckBox
							containerStyle={{ backgroundColor: "transparent" }}
							title="Male"
							checked={formData.gender === "Male"}
							onPress={() => setFormData({ ...formData, gender: "Male" })}
							checkedIcon="dot-circle-o"
							uncheckedIcon="circle-o"
						/>
						<CheckBox
							containerStyle={{ backgroundColor: "transparent" }}
							title="Female"
							checked={formData.gender === "Female"}
							onPress={() => setFormData({ ...formData, gender: "Female" })}
							checkedIcon="dot-circle-o"
							uncheckedIcon="circle-o"
						/>
					</View>
					<View style={{ flexDirection: "row", columnGap: 10 }}>
						<View style={{ flex: 1 }}>
							<Text style={{ fontWeight: "bold", marginBottom: 5 }}>Date of Birth:</Text>
							<TouchableOpacity onPress={() => showDatePicker("dateOfBirth")}>
								<TextInput
									editable={false}
									style={styles.input}
									placeholder="MM/DD/YYYY"
									placeholderTextColor={"gray"}
									value={formData.dateOfBirth}
								/>
							</TouchableOpacity>
						</View>
						<View style={{ flex: 1 }}>
							<Text style={{ fontWeight: "bold", marginBottom: 5 }}>Date of Death:</Text>
							<TouchableOpacity onPress={() => showDatePicker("dateOfDeath")}>
								<TextInput
									editable={false}
									style={styles.input}
									placeholder="MM/DD/YYYY"
									placeholderTextColor={"gray"}
									value={formData.dateOfDeath}
								/>
							</TouchableOpacity>
						</View>
					</View>

					<Text style={{ fontWeight: "bold", marginBottom: 5 }}>Date of Burial:</Text>
					<TouchableOpacity onPress={() => showDatePicker("dateOfBurial")}>
						<TextInput
							editable={false}
							style={styles.input}
							placeholder="MM/DD/YYYY"
							placeholderTextColor={"gray"}
							value={formData.dateOfBurial}
						/>
					</TouchableOpacity>
					<Text style={{ fontWeight: "bold", marginBottom: 5 }}>
						Upload Picture of Death Certificate:
					</Text>
					<TouchableOpacity style={styles.input} onPress={pickImage}>
						<Feather style={{ alignSelf: "flex-end" }} name={"upload"} size={24} color="black" />
					</TouchableOpacity>
					{image?.uri && (
						<View style={{ height: 300, width: "100%", marginBottom: 10 }}>
							<Image
								source={{ uri: image?.uri }}
								style={{ height: "100%", width: "100%" }}
								resizeMode="contain"
							/>
						</View>
					)}
					<DateTimePickerModal
						isVisible={isDatePickerVisible}
						mode="date"
						onConfirm={handleConfirm}
						onCancel={hideDatePicker}
					/>
					<Text style={{ fontWeight: "bold" }}>Privacy</Text>
					<View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
						<CheckBox
							containerStyle={{ backgroundColor: "transparent" }}
							title="Public"
							checked={formData.privacy === "Public"}
							onPress={() => setFormData({ ...formData, privacy: "Public" })}
							checkedIcon="dot-circle-o"
							uncheckedIcon="circle-o"
						/>
						<CheckBox
							containerStyle={{ backgroundColor: "transparent" }}
							title="Private"
							checked={formData.privacy === "Private"}
							onPress={() => setFormData({ ...formData, privacy: "Private" })}
							checkedIcon="dot-circle-o"
							uncheckedIcon="circle-o"
						/>
					</View>
					<TouchableOpacity style={styles.button} onPress={handleAddRecord}>
						<Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Add Record</Text>
					</TouchableOpacity>
				</KeyboardAwareScrollView>
			</View>
		</Modal>
	);
};

export default AddRecord;

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
		paddingHorizontal: 25,
		paddingBottom: 20,
	},
	header: {
		backgroundColor: "black",
		height: 60,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	input: {
		marginBottom: 20,
		padding: 10,
		backgroundColor: "white",
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 8,
	},
	text: {
		color: "black",
		fontWeight: "bold",
		alignSelf: "flex-start",
		marginBottom: 10,
	},
	button: {
		alignSelf: "center",
		alignItems: "center",
		width: 200,
		marginTop: 20,
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: COLORS.primary,
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 10,
	},
});
