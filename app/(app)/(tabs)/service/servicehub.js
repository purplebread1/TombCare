import { useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { COLORS } from "../../../../constants/Colors";
import { Link, router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const ServiceHub = () => {
	const orders = [
		{
			service: "Tomb Maintenance",
			from: "Juan Delacruz",
			types: ["Tomb Cleaning", "Tomb Painting", "Flower Decor", "Grass Cutting"],
		},
		{ service: "Tomb Construction", from: "Mark Sancho", types: ["Tomb Construction"] },
	];

	const Services = () => {
		return (
			<View style={styles.serviceContainer}>
				{orders.map((order, index) => (
					<View key={index} style={styles.button}>
						<Link href="/service/requestdetails/" asChild>
							<TouchableOpacity style={styles.view}>
								<Text
									style={{
										color: "white",
										fontWeight: "bold",
									}}
								>
									View
								</Text>
							</TouchableOpacity>
						</Link>

						<Text>From:</Text>
						<Text>{order.from}</Text>
						<View
							style={{
								flexWrap: "wrap",
								flexDirection: "row",
								columnGap: 20,
								alignItems: "center",
							}}
						>
							{order.types.map((type, index) => (
								<View key={index} style={styles.serviceType}>
									<Text>{type}</Text>
								</View>
							))}
						</View>
					</View>
				))}
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Image style={styles.eclipse} source={require("../../../../assets/images/eclipse.png")} />
			{/* Header */}
			<View style={styles.header}>
				<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Service Hub</Text>
			</View>
			<View style={styles.innerContainer}>
				<Text style={styles.text}>Maintenance Requests</Text>

				<Services />
			</View>
		</View>
	);
};

export default ServiceHub;

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
		paddingHorizontal: 15,
	},
	header: {
		backgroundColor: "black",
		height: 60,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	serviceContainer: {
		rowGap: 10,
	},
	button: {
		width: "100%",
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: "white",
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 10,
	},
	text: {
		color: "black",
		fontSize: 18,
		fontWeight: "bold",
		alignSelf: "flex-start",
		marginBottom: 20,
	},
	view: {
		position: "absolute",
		top: 10,
		right: 20,
		zIndex: 10,
		backgroundColor: COLORS.primary,
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 50,
	},
	serviceType: {
		width: "45%",
		backgroundColor: COLORS.primary,
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 50,
		marginBottom: 10,
	},
});
