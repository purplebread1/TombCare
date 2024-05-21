import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/Colors";
import { Link } from "expo-router";

const Landing = () => {
	return (
		<View style={styles.container}>
			<Image style={styles.eclipse} source={require("../assets/images/eclipse.png")} />
			<View style={styles.innerContainer}>
				<Image style={{ marginBottom: 50 }} source={require("../assets/images/logo.png")} />
				<Image style={{ marginBottom: 20 }} source={require("../assets/images/gravestone.png")} />
				<Text style={styles.text}>A Tomb Management System and Service Assistance</Text>
				<Link replace href="/login" asChild>
					<TouchableOpacity style={styles.button}>
						<Text style={{ color: "black", fontWeight: "bold" }}>Get Started</Text>
					</TouchableOpacity>
				</Link>
			</View>
		</View>
	);
};

export default Landing;

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
		width: 250,
		textAlign: "center",
		fontWeight: "bold",
		color: COLORS.primary,
		fontSize: 15,
	},
	button: {
		marginTop: 50,
		paddingHorizontal: 80,
		paddingVertical: 15,
		backgroundColor: COLORS.primary,
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 10,
	},
});
