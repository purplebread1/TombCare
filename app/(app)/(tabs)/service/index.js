import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { COLORS } from "../../../../constants/Colors";
import { Link } from "expo-router";

const SelectService = () => {
	const services = [
		{ title: "Tomb Services", navigation: "/service/tombservices" },
		{ title: "Lot Services", navigation: "/service/lotservices" },
	];

	const Services = () => {
		return (
			<View style={styles.serviceContainer}>
				{services.map((service, index) => (
					<Link key={index} href={service.navigation} asChild>
						<TouchableOpacity style={styles.button}>
							<Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>
								{service.title}
							</Text>
						</TouchableOpacity>
					</Link>
				))}
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Image style={styles.eclipse} source={require("../../../../assets/images/eclipse.png")} />
			{/* Header */}
			<View style={styles.header}>
				<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
					Select Service Type
				</Text>
			</View>
			<View style={styles.innerContainer}>
				<Services />
			</View>
		</View>
	);
};

export default SelectService;

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
		rowGap: 10,
		width: "100%",
	},
	button: {
		width: "100%",
		padding: 12,
		backgroundColor: COLORS.primary,
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 10,
		alignItems: "center",
	},
	orderButton: {
		alignSelf: "flex-end",
		alignItems: "center",
		width: 130,
		marginTop: 50,
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: COLORS.primary,
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 10,
	},
});
