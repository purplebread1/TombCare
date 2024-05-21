import { useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { COLORS } from "../constants/Colors";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserStore } from "../store";
import { useStoreState } from "pullstate";

const SignUpForm = () => {
	const USER = useStoreState(UserStore);
	const [password, setPassword] = useState("");
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	return (
		<View style={styles.container}>
			<Text style={[styles.text, { fontSize: 20, marginVertical: 10 }]}>{USER.type}</Text>
			<Text style={[styles.text, { fontSize: 20, marginBottom: 20 }]}>Sign Up</Text>
			<Image style={styles.eclipse} source={require("../assets/images/eclipse.png")} />
			<View style={styles.innerContainer}>
				<View style={{ flexDirection: "row", columnGap: 10 }}>
					<TextInput
						style={[styles.input, { flex: 1 }]}
						placeholder="First Name"
						placeholderTextColor={"black"}
					/>
					<TextInput
						style={[styles.input, { flex: 1 }]}
						placeholder="Last Name"
						placeholderTextColor={"black"}
					/>
				</View>
				<TextInput
					style={[styles.input, { width: "80%", alignSelf: "flex-start" }]}
					placeholder="Mobile Number"
					placeholderTextColor={"black"}
				/>
				<TextInput
					style={styles.input}
					placeholder="Email Address"
					placeholderTextColor={"black"}
				/>
				<View style={styles.password}>
					<TextInput
						placeholder="Password"
						placeholderTextColor="black"
						secureTextEntry={!isPasswordVisible}
						value={password}
						onChangeText={setPassword}
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
				/>
				<Link replace href="login" asChild>
					<TouchableOpacity style={styles.button}>
						<Text style={{ color: "white", fontWeight: "bold" }}>Sign Up</Text>
					</TouchableOpacity>
				</Link>
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
			</View>
		</View>
	);
};

export default SignUpForm;

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
		paddingHorizontal: 30,
	},
	text: {
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
		padding: 5,
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
		padding: 5,
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
