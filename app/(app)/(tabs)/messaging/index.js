import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { COLORS } from "../../../../constants/Colors";
import { Link } from "expo-router";

const Messaging = () => {
	return (
		<View style={styles.container}>
			<Image style={styles.eclipse} source={require("../../../../assets/images/eclipse.png")} />
			{/* Header */}
			<View style={styles.header}>
				<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Messaging</Text>
			</View>
			<View style={styles.innerContainer}>
				<Text style={{ fontSize: 18, fontWeight: "bold" }}>Under Construction :)</Text>
			</View>
		</View>
	);
};

export default Messaging;

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
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 25,
	},
	header: {
		backgroundColor: "black",
		height: 60,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
});
