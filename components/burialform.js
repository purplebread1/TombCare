import { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { COLORS } from "../constants/Colors";
import { Link, router } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CheckBox } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";

const BurialForm = ({ onFormDataChange }) => {
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
	const [activeDateField, setActiveDateField] = useState(null);
	const [image, setImage] = useState(null);

	const [formData, setFormData] = useState({
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

	useEffect(() => {
		getPermissions();
	}, []);

	const getPermissions = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			alert("Sorry, we need camera roll permissions to make this work!");
		}
	};

	// Notify parent whenever formData changes
	useEffect(() => {
		if (onFormDataChange) {
			onFormDataChange(formData, image);
		}
	}, [formData, image]);

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

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Enter information of the Deceased</Text>
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
			{/* <View style={{ flexDirection: "row", columnGap: 10 }}>
				<TextInput
					style={[styles.input, { flex: 1 }]}
					placeholder="Column Number"
					placeholderTextColor={"gray"}
				/>
				<Text style={{ flex: 1, fontWeight: "bold" }}>*Only applicable to tombs</Text>
			</View> */}
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
			<DateTimePickerModal
				isVisible={isDatePickerVisible}
				mode="date"
				onConfirm={handleConfirm}
				onCancel={hideDatePicker}
			/>
		</View>
	);
};

export default BurialForm;

const styles = StyleSheet.create({
	container: {
		marginTop: 30,
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
});
