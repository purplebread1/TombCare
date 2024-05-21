import { useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { COLORS } from "../../../../constants/Colors";
import { Link, router } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const RequestBurial = () => {
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

	const showDatePicker = () => {
		setDatePickerVisibility(true);
	};

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	const handleConfirm = (date) => {
		hideDatePicker();
	};
	return (
		<View style={styles.container}>
			<Image style={styles.eclipse} source={require("../../../../assets/images/eclipse.png")} />
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()} style={{ position: "absolute", left: 10 }}>
					<AntDesign name={"left"} size={24} color="white" />
				</TouchableOpacity>
				<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Request Burial</Text>
			</View>
			<View style={styles.innerContainer}>
				<Text style={styles.text}>Enter information of the Deceased</Text>
				<TextInput
					style={[styles.input, { width: 200 }]}
					placeholder="Lot ID"
					placeholderTextColor={"gray"}
				/>
				<View style={{ flexDirection: "row", columnGap: 10 }}>
					<TextInput
						style={[styles.input, { flex: 2 }]}
						placeholder="First Name"
						placeholderTextColor={"gray"}
					/>
					<TextInput
						style={[styles.input, { flex: 2 }]}
						placeholder="Last Name"
						placeholderTextColor={"gray"}
					/>
					<TextInput
						style={[styles.input, { flex: 1 }]}
						placeholder="MI"
						placeholderTextColor={"gray"}
					/>
				</View>
				<View style={{ flexDirection: "row", columnGap: 10 }}>
					<TextInput
						style={[styles.input, { flex: 1 }]}
						placeholder="Date of Birth"
						placeholderTextColor={"gray"}
					/>
					<TextInput
						style={[styles.input, { flex: 1 }]}
						placeholder="Date of Death"
						placeholderTextColor={"gray"}
					/>
				</View>
				<View style={{ flexDirection: "row", columnGap: 10 }}>
					<TextInput
						style={[styles.input, { flex: 1 }]}
						placeholder="Column Number"
						placeholderTextColor={"gray"}
					/>
					<Text style={{ flex: 1, fontWeight: "bold" }}>*Only applicable to tombs</Text>
				</View>
				<Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>Date of Burial:</Text>
				<TouchableOpacity onPress={showDatePicker}>
					<TextInput
						editable={false}
						style={[styles.input, { width: 200 }]}
						placeholder="MM/DD/YYYY"
						placeholderTextColor={"gray"}
					/>
				</TouchableOpacity>
				<Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>
					Upload Picture of Death Certificate:
				</Text>
				<TouchableOpacity style={[styles.input, { width: 200 }]}>
					<Feather style={{ alignSelf: "flex-end" }} name={"upload"} size={24} color="black" />
				</TouchableOpacity>
				<DateTimePickerModal
					isVisible={isDatePickerVisible}
					mode="date"
					onConfirm={handleConfirm}
					onCancel={hideDatePicker}
				/>
				<Link replace href="/service/orderconfirm" asChild>
					<TouchableOpacity style={styles.button}>
						<Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Send</Text>
					</TouchableOpacity>
				</Link>
			</View>
		</View>
	);
};

export default RequestBurial;

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
		paddingHorizontal: 20,
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
		alignSelf: "center",
		alignItems: "center",
		width: 100,
		marginTop: 50,
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: COLORS.primary,
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 10,
	},
	input: {
		marginBottom: 20,
		paddingHorizontal: 10,
		paddingVertical: 5,
		backgroundColor: "white",
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 8,
	},
	text: {
		color: "black",
		fontSize: 18,
		fontWeight: "bold",
		alignSelf: "flex-start",
		marginBottom: 20,
	},
});
