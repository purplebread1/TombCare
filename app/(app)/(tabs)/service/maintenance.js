import { useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { COLORS } from "../../../../constants/Colors";
import { Link, router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const Maintenance = () => {
	const [type, setType] = useState([
		{ title: "Tomb Cleaning", price: 500, pressed: true },
		{ title: "Tomb Painting", price: 1500, pressed: false },
		{ title: "Flower Decor", price: 360, pressed: false },
		{ title: "Grass Cutting", price: 250, pressed: false },
	]);

	const handleTypePress = (title) => {
		setType((prevTypes) =>
			prevTypes.map((item) => (item.title === title ? { ...item, pressed: !item.pressed } : item))
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
				<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
					Request Maintenance
				</Text>
			</View>
			<View style={styles.innerContainer}>
				<TextInput style={styles.input} placeholder="Enter Tomb ID" placeholderTextColor={"gray"} />
				<Text style={styles.text}>Select Maintenance Type:</Text>
				<View style={styles.serviceContainer}>
					{type.slice(0, 2).map((type, index) => (
						<TouchableOpacity
							onPress={() => handleTypePress(type.title)}
							key={index}
							style={styles.typeButton}
						>
							<View style={styles.innerButton}>
								<View>
									<Text style={{ color: "black", fontWeight: "bold" }}>{type.title}</Text>
									<Text style={{ color: "white" }}>₱{type.price.toLocaleString()}</Text>
								</View>
								{type.pressed && <AntDesign name={"checkcircle"} size={20} color="black" />}
							</View>
						</TouchableOpacity>
					))}
				</View>
				<View style={styles.serviceContainer}>
					{type.slice(2).map((type, index) => (
						<TouchableOpacity
							onPress={() => handleTypePress(type.title)}
							key={index}
							style={styles.typeButton}
						>
							<View style={styles.innerButton}>
								<View>
									<Text style={{ color: "black", fontWeight: "bold" }}>{type.title}</Text>
									<Text style={{ color: "white" }}>₱{type.price.toLocaleString()}</Text>
								</View>
								{type.pressed && <AntDesign name={"checkcircle"} size={20} color="black" />}
							</View>
						</TouchableOpacity>
					))}
				</View>
				<Link replace href="/service/orderconfirm" asChild>
					<TouchableOpacity style={styles.button}>
						<Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Order</Text>
					</TouchableOpacity>
				</Link>
			</View>
		</View>
	);
};

export default Maintenance;

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
		fontSize: 18,
		fontWeight: "bold",
		alignSelf: "flex-start",
		marginBottom: 20,
	},
});
