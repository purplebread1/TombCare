import { useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { COLORS } from "../../../../constants/Colors";
import { Link, router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const RequestDetails = () => {
	const types = [
		{ title: "Tomb Cleaning", price: 500 },
		{ title: "Tomb Painting", price: 1500 },
		{ title: "Flower Decor", price: 360 },
		{ title: "Grass Cutting", price: 250 },
	];

	return (
		<View style={styles.container}>
			<Image style={styles.eclipse} source={require("../../../../assets/images/eclipse.png")} />
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()} style={{ position: "absolute", left: 10 }}>
					<AntDesign name={"left"} size={24} color="white" />
				</TouchableOpacity>
				<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Request Details</Text>
			</View>
			<View style={styles.innerContainer}>
				<View
					style={{
						backgroundColor: "white",
						borderColor: "black",
						borderWidth: 1,
						borderRadius: 5,
						padding: 10,
					}}
				>
					<Text style={styles.text}>From:</Text>
					<Text style={styles.text}>Marco Deluna</Text>
					<Text style={styles.text}>09984324325</Text>
					<Text style={[styles.text, { marginTop: 50 }]}>Deceased Name: Jose Delacruz</Text>
					<Text style={[styles.text, { marginBottom: 30 }]}>Tomb ID: 13</Text>
					<View style={styles.serviceContainer}>
						{types.slice(0, 2).map((type, index) => (
							<View key={index} style={styles.typeButton}>
								<View style={styles.innerButton}>
									<View>
										<Text style={{ color: "black", fontWeight: "bold" }}>{type.title}</Text>
										<Text style={{ color: "white" }}>₱{type.price.toLocaleString()}</Text>
									</View>
									{type.pressed && <AntDesign name={"checkcircle"} size={20} color="black" />}
								</View>
							</View>
						))}
					</View>
					<View style={styles.serviceContainer}>
						{types.slice(2).map((type, index) => (
							<View key={index} style={styles.typeButton}>
								<View style={styles.innerButton}>
									<View>
										<Text style={{ color: "black", fontWeight: "bold" }}>{type.title}</Text>
										<Text style={{ color: "white" }}>₱{type.price.toLocaleString()}</Text>
									</View>
								</View>
							</View>
						))}
					</View>
				</View>
				{/* <Link replace href="/service/orderconfirm" asChild> */}
				<TouchableOpacity style={styles.button}>
					<Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Accept</Text>
				</TouchableOpacity>
				{/* </Link> */}
			</View>
		</View>
	);
};

export default RequestDetails;

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
	},
	header: {
		backgroundColor: "black",
		height: 60,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	serviceContainer: {
		marginTop: 10,
		flexDirection: "row",
		columnGap: 10,
	},
	typeButton: {
		flex: 1,
		padding: 10,
		backgroundColor: COLORS.primary,
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 10,
	},
	innerButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
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
		width: 200,
		paddingHorizontal: 10,
		paddingVertical: 5,
		backgroundColor: "white",
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 8,
	},
	text: {
		color: "black",
		fontSize: 16,
		fontWeight: "bold",
		alignSelf: "flex-start",
	},
});
