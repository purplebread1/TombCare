import { useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { COLORS } from "../../../../constants/Colors";
import { Link, router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const Orders = () => {
	const orders = [
		{ service: "Tomb Maintenance", worker: "Juan Delacruz", tombId: 13, status: "On-Going" },
		{ service: "Tomb Construction", worker: "Mark Sancho", status: "Completed" },
	];

	const Services = () => {
		return (
			<View style={styles.serviceContainer}>
				{orders.map((order, index) => (
					<View key={index} style={styles.button}>
						{order.status !== "Completed" && (
							<Link href="messaging" asChild>
								<TouchableOpacity
									style={{
										position: "absolute",
										top: 10,
										right: 20,
										zIndex: 10,
									}}
								>
									<Text
										style={{
											color: COLORS.neongreen,
											fontWeight: "bold",
										}}
									>
										Message
									</Text>
								</TouchableOpacity>
							</Link>
						)}
						<Text style={{ fontSize: 18 }}>{order.service}</Text>
						<Text style={{ fontSize: 18 }}>Worker: {order.worker}</Text>
						{order?.tombId && <Text style={{ fontSize: 18 }}>Tomb ID: {order.tombId}</Text>}
						<View
							style={{
								backgroundColor: order.status === "Completed" ? COLORS.completed : COLORS.ongoing,
								padding: 5,
								width: 100,
								borderRadius: 50,
								alignItems: "center",
								alignSelf: "flex-end",
							}}
						>
							<Text style={{ color: "white" }}>{order.status}</Text>
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
				<TouchableOpacity onPress={() => router.back()} style={{ position: "absolute", left: 10 }}>
					<AntDesign name={"left"} size={24} color="white" />
				</TouchableOpacity>
				<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Your Orders</Text>
			</View>
			<View style={styles.innerContainer}>
				<Services />
			</View>
		</View>
	);
};

export default Orders;

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
		backgroundColor: COLORS.primary,
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
});
