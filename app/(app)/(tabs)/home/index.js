import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { COLORS } from "../../../../constants/Colors";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
	return (
		<View style={styles.container}>
			<Image style={styles.eclipse} source={require("../../../../assets/images/eclipse.png")} />
			<Text style={styles.text}>Welcome</Text>
			<View style={styles.innerContainer}>
				<Image
					style={{ width: "100%", height: "100%" }}
					source={require("../../../../assets/images/map.png")}
				/>

				{/* <Link replace href="/login" asChild> */}
				<View style={styles.input}>
					<TextInput
						style={{ color: "white" }}
						placeholder="Search Tomb"
						placeholderTextColor="white"
					/>
					<TouchableOpacity>
						<Ionicons name={"search-outline"} size={24} color="black" />
					</TouchableOpacity>
				</View>
				{/* </Link> */}
			</View>
		</View>
	);
};

export default Home;

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
	},
	text: {
		marginVertical: 10,
		textAlign: "center",
		fontWeight: "bold",
		color: "black",
		fontSize: 20,
	},
	input: {
		position: "absolute",
		bottom: 50,
		flexDirection: "row",
		marginTop: 50,
		width: 180,
		paddingHorizontal: 15,
		paddingVertical: 10,
		backgroundColor: COLORS.primary,
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 15,
		alignItems: "center",
		justifyContent: "space-between",
	},
});
