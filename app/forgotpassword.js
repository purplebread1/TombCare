import { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, Keyboard } from "react-native";
import { COLORS } from "../constants/Colors";
import { Link, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");

	const handleResetPassword = async () => {
		try {
			await sendPasswordResetEmail(FIREBASE_AUTH, email);
			alert("Password reset email sent! Please check your inbox.");
			router.replace("/login");
		} catch (error) {
			console.error("Error resetting password:", error);
		}
	};

	return (
		<View style={styles.container}>
			<Image style={styles.eclipse} source={require("../assets/images/eclipse.png")} />
			<View style={styles.innerContainer}>
				<Image style={{ marginBottom: 50 }} source={require("../assets/images/logo.png")} />
				<TextInput
					style={styles.input}
					placeholder="Email Address"
					placeholderTextColor={"black"}
					value={email}
					onChangeText={setEmail}
				/>
				<TouchableOpacity style={styles.button} onPress={handleResetPassword}>
					<Text style={{ color: "white", fontWeight: "bold" }}>Reset Password</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ForgotPassword;

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
		alignItems: "center",
		justifyContent: "center",
	},

	button: {
		marginTop: 20,
		paddingHorizontal: 40,
		paddingVertical: 10,
		backgroundColor: COLORS.primary,
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 5,
	},
	input: {
		marginBottom: 20,
		width: 250,
		padding: 10,
		backgroundColor: "white",
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 5,
	},
});
