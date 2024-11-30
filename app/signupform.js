import { useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { COLORS } from "../constants/Colors";
import Loading from "../components/loading";
import { Link, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signUp } from "../store";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SignUpForm = () => {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState({
		firstName: "",
		lastName: "",
		mobileNumber: "09",
		email: "",
		password: "",
		address: "",
	});

	const handleSubmit = async () => {
		if (!validateFields()) {
			alert("Please fill in all the required fields.");
			return;
		}

		if (user.password.length < 6) {
			alert("Password must be at least 6 characters long.");
			return;
		}

		setLoading(true);

		const userId = await signUp(user);
		if (userId) {
			alert("Registered successfully!");
		}
		setLoading(false);

		router.replace("/login");
	};

	const validateFields = () => {
		return (
			user.firstName !== "" &&
			user.lastName !== "" &&
			user.mobileNumber !== "" &&
			user.email !== "" &&
			user.password !== "" &&
			user.address !== ""
		);
	};

	return (
		<View style={styles.container}>
			{loading && <Loading />}
			<Text style={[styles.text, { fontSize: 20, marginVertical: 20 }]}>Sign Up</Text>
			<Image style={styles.eclipse} source={require("../assets/images/eclipse.png")} />
			<KeyboardAwareScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.innerContainer}
			>
				<View style={{ flexDirection: "row", columnGap: 10 }}>
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
					style={[styles.input, { width: "80%", alignSelf: "flex-start" }]}
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
					placeholder="Email Address"
					placeholderTextColor={"black"}
					value={user.email}
					onChangeText={(text) => setUser({ ...user, email: text })}
				/>
				<View style={styles.password}>
					<TextInput
						placeholder="Password"
						placeholderTextColor="black"
						secureTextEntry={!isPasswordVisible}
						value={user.password}
						onChangeText={(text) => setUser({ ...user, password: text })}
					/>
					<TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
						<MaterialCommunityIcons
							name={isPasswordVisible ? "eye" : "eye-off"}
							size={24}
							color="gray"
						/>
					</TouchableOpacity>
				</View>
				<TextInput
					style={[styles.input, { marginTop: 15 }]}
					placeholder="Address"
					placeholderTextColor={"black"}
					value={user.address}
					onChangeText={(text) => setUser({ ...user, address: text })}
				/>

				<TouchableOpacity style={styles.button} onPress={handleSubmit}>
					<Text style={{ color: "white", fontWeight: "bold" }}>Sign Up</Text>
				</TouchableOpacity>

				<Text style={[styles.text, { marginVertical: 10 }]}>or</Text>
				<TouchableOpacity style={styles.google}>
					<Image
						style={{ height: 25, width: 25 }}
						source={require("../assets/images/google.png")}
					/>

					<Text style={{ color: "black", fontWeight: "bold" }}>Login with Gmail</Text>
				</TouchableOpacity>
				<Text style={[styles.text, { marginTop: 50 }]}>
					Already have an account?{" "}
					<Link href="login" style={[styles.text, { color: COLORS.primary }]}>
						Login
					</Link>
				</Text>
			</KeyboardAwareScrollView>
		</View>
	);
};

export default SignUpForm;

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLORS.background,
		flex: 1,
		justifyContent: "center",
	},
	eclipse: {
		position: "absolute",
		top: -30,
		left: -50,
	},
	innerContainer: {
		alignItems: "center",
		paddingHorizontal: 30,
	},
	text: {
		zIndex: 10,
		textAlign: "center",
		fontWeight: "bold",
		color: "black",
		fontSize: 15,
	},
	button: {
		marginTop: 50,
		paddingHorizontal: 60,
		paddingVertical: 10,
		backgroundColor: COLORS.primary,
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 5,
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
	password: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderWidth: 1,
		borderColor: "black",
		borderRadius: 5,
		padding: 10,
		backgroundColor: "white",
		width: "100%",
	},
	google: {
		width: 200,
		padding: 10,
		flexDirection: "row",
		backgroundColor: "white",
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 5,
		justifyContent: "space-between",
		alignItems: "center",
	},
});
