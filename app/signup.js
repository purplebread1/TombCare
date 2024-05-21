import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/Colors";
import { Link, router } from "expo-router";
import { UserStore } from "../store";

const Signup = () => {
	const handlePress = (type) => {
		UserStore.update((store) => {
			store.type = type;
		});
		router.navigate("signupform");
	};
	return (
		<View style={styles.container}>
			<Image style={styles.eclipse} source={require("../assets/images/eclipse.png")} />
			<View style={styles.innerContainer}>
				<Text style={[styles.text, { fontSize: 30, marginBottom: 60 }]}>Sign Up as</Text>

				<TouchableOpacity style={styles.button} onPress={() => handlePress("Cemetery Visitor")}>
					<Text style={styles.buttonText}>Cemetery Visitor</Text>
				</TouchableOpacity>

				<Text style={[styles.text, { marginVertical: 15 }]}>or</Text>

				<TouchableOpacity style={styles.button} onPress={() => handlePress("Service Worker")}>
					<Text style={styles.buttonText}>Apply as Service Worker</Text>
				</TouchableOpacity>

				<Text style={[styles.text, { marginTop: 60, marginBottom: 15 }]}>or</Text>
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

export default Signup;

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
	buttonText: {
		textAlign: "center",
		fontWeight: "bold",
		color: "white",
		fontSize: 16,
	},
	button: {
		width: 250,
		padding: 15,
		backgroundColor: COLORS.primary,
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 5,
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
