import { useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { COLORS } from "../../../../constants/Colors";
import { Link, router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const ConstructDig = () => {
	return (
		<View style={styles.container}>
			<Image style={styles.eclipse} source={require("../../../../assets/images/eclipse.png")} />
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()} style={{ position: "absolute", left: 10 }}>
					<AntDesign name={"left"} size={24} color="white" />
				</TouchableOpacity>
				<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
					Construction/Digging
				</Text>
			</View>
			<View style={styles.innerContainer}>
				<Text style={[styles.text, { color: "red" }]}>
					This service is only applicable to lot owners.
				</Text>
				<Text style={styles.text}>Please enter information:</Text>
				<TextInput
					style={[styles.input, { width: 150 }]}
					placeholder="Enter Lot ID"
					placeholderTextColor={"gray"}
				/>
				<TextInput
					style={[styles.input, { width: 200 }]}
					placeholder="Tomb Construction"
					placeholderTextColor={"gray"}
				/>

				<TextInput
					multiline
					textAlignVertical="top"
					style={styles.largeInput}
					placeholder="Enter Additional Instruction"
					placeholderTextColor={"gray"}
				/>

				<Link replace href="/service/orderconfirm" asChild>
					<TouchableOpacity style={styles.button}>
						<Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Submit</Text>
					</TouchableOpacity>
				</Link>
			</View>
		</View>
	);
};

export default ConstructDig;

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
	largeInput: {
		width: "100%",
		height: 200,
		paddingHorizontal: 10,
		paddingTop: 10,
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
