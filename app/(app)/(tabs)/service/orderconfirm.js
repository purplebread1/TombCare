import { useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { COLORS } from "../../../../constants/Colors";
import { Link, router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import Rating from "../../../../components/rating";

const OrderConfirm = () => {
	const worker = {
		id: 1,
		picture: { uri: "https://source.unsplash.com/UpiF461EAHU" },
		name: "Juan Delacruz",
		number: "09123456789",
		rating: 5,
	};

	return (
		<View style={styles.container}>
			<Image style={styles.eclipse} source={require("../../../../assets/images/eclipse.png")} />
			{/* Header */}
			<View style={styles.header}>
				<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
					Your Order has been confirmed!
				</Text>
			</View>
			<View style={styles.innerContainer}>
				<View
					style={{
						backgroundColor: "white",
						borderRadius: 10,
						padding: 10,
						width: "60%",
						marginLeft: 20,
					}}
				>
					<Text style={{ fontSize: 16 }}>Tomb ID No. 13</Text>
					<Text style={{ fontSize: 16 }}>Name: Jose Delacruz</Text>
				</View>
				<View
					style={{ backgroundColor: "white", flex: 1, padding: 10, width: "100%", marginTop: 20 }}
				>
					<Text style={styles.text}>Your Service Worker</Text>
					<View style={{ flexDirection: "row", alignItems: "center", columnGap: 10 }}>
						<Image source={worker.picture} style={{ height: 100, width: 100, borderRadius: 100 }} />
						<View>
							<Text style={[styles.text, { marginBottom: 0 }]}>{worker.name}</Text>
							<Text style={[styles.text, { marginBottom: 0 }]}>{worker.number}</Text>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Rating rating={worker.rating} size={16} />
							</View>
						</View>
					</View>
					{/* <Link replace href="/messaging/index" asChild> */}
					<TouchableOpacity style={styles.button}>
						<Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Message</Text>
					</TouchableOpacity>
					{/* </Link> */}
				</View>
			</View>
		</View>
	);
};

export default OrderConfirm;

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
	text: {
		color: "black",
		fontSize: 18,
		fontWeight: "bold",
		alignSelf: "flex-start",
		marginBottom: 20,
	},
});
