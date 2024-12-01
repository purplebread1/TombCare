import { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, Keyboard } from "react-native";
import { COLORS } from "../constants/Colors";
import { Link, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signIn, googleSignUp } from "../store";
import Loading from "../components/loading";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const Login = () => {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	useEffect(() => {
		GoogleSignin.configure({
			webClientId: "178689170689-9q1hn183qn631a39vf3sb8gnbu00mm9e.apps.googleusercontent.com",
		});
	}, []);

	const handleLogin = async () => {
		Keyboard.dismiss();
		setLoading(true);
		const success = await signIn(email, password);
		setLoading(false);
		if (!success) return;
		router.replace("/(tabs)/home");
	};

	const signInWithGoogle = async () => {
		try {
			await GoogleSignin.hasPlayServices();
			const user = await GoogleSignin.signIn();

			if (user?.data?.idToken) {
				setLoading(true);
				const credential = GoogleAuthProvider.credential(user.data.idToken);
				signInWithCredential(FIREBASE_AUTH, credential)
					.then((userCredential) => {
						const userInfo = userCredential.user;
						console.log(JSON.stringify(userInfo, null, 2));
						googleSignUp(userInfo.uid, user.data.user);
						router.replace("/(tabs)/home");
					})
					.catch((error) => {
						console.log(error);
					})
					.finally(() => {
						setLoading(false);
					});
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<View style={styles.container}>
			{loading && <Loading />}
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
				<View style={styles.password}>
					<TextInput
						style={{ flex: 1 }}
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
				<Link href="/forgotpassword" asChild>
					<TouchableOpacity>
						<Text style={styles.forgotPassword}>Forgot Password?</Text>
					</TouchableOpacity>
				</Link>

				<TouchableOpacity style={styles.button} onPress={handleLogin}>
					<Text style={{ color: "white", fontWeight: "bold" }}>Log In</Text>
				</TouchableOpacity>

				<Text style={[styles.text, { marginVertical: 10 }]}>or</Text>
				<TouchableOpacity style={styles.google} onPress={signInWithGoogle}>
					<Image
						style={{ height: 25, width: 25 }}
						source={require("../assets/images/google.png")}
					/>

					<Text style={{ color: "black", fontWeight: "bold" }}>Login with Gmail</Text>
				</TouchableOpacity>
				<Text style={[styles.text, { marginTop: 50 }]}>
					Don't have an account?{" "}
					<Link href="signupform" style={[styles.text, { color: COLORS.primary }]}>
						Sign Up
					</Link>
				</Text>
			</View>
		</View>
	);
};

export default Login;

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
	text: {
		textAlign: "center",
		fontWeight: "bold",
		color: "black",
		fontSize: 15,
	},
	forgotPassword: {
		width: 250,
		fontWeight: "bold",
		color: COLORS.primary,
		textAlign: "right",
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
		marginBottom: 20,
		width: 250,
		padding: 10,
		backgroundColor: "white",
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 5,
	},
	password: {
		padding: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderWidth: 1,
		borderColor: "black",
		borderRadius: 5,
		backgroundColor: "white",
		width: 250,
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
