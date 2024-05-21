import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { COLORS } from "../../../../constants/Colors";
import { Link } from "expo-router";
import { Entypo } from "@expo/vector-icons";

const Profile = () => {
	const user = {
		id: 1,
		picture: { uri: "https://source.unsplash.com/UpiF461EAHU" },
		name: "Marco Deluna",
		number: "09123456789",
		email: "mdeluna@gmail.com",
		address: "Purok 1, Barangay 2, Cebu City",
		gender: "Male",
	};
	return (
		<View style={styles.container}>
			<Image style={styles.eclipse} source={require("../../../../assets/images/eclipse.png")} />
			{/* Header */}
			<View style={styles.header}>
				<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Profile</Text>
			</View>
			<View style={styles.innerContainer}>
				<View style={{ flex: 1, width: "100%", padding: 10 }}>
					<View style={{ flexDirection: "row", alignItems: "center", columnGap: 10 }}>
						<Image source={user.picture} style={{ height: 100, width: 100, borderRadius: 100 }} />
						<View>
							<Text style={styles.text}>{user.name}</Text>
							<Text style={styles.text}>{user.number}</Text>
							<Text style={styles.text}>{user.email}</Text>
						</View>
					</View>
					{/* <Link href="/service/orderconfirm" asChild> */}
					<TouchableOpacity style={styles.button}>
						<Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>Edit Profile</Text>
					</TouchableOpacity>
					{/* </Link> */}
				</View>
				<View
					style={{
						flex: 2,
						width: "100%",
						padding: 10,
						marginVertical: 30,
						backgroundColor: "white",
						borderRadius: 10,
					}}
				>
					<Text style={[styles.text, { fontSize: 20 }]}>Address:</Text>
					<Text style={styles.text}>{user.address}</Text>
					<Text style={[styles.text, { fontSize: 20, marginTop: 10 }]}>Gender:</Text>
					<Text style={styles.text}>{user.gender}</Text>
				</View>
				<View style={{ flex: 1, width: "100%", alignItems: "center" }}>
					{/* <Link replace href="login"> */}
					<TouchableOpacity style={{ alignItems: "center" }}>
						<Entypo name={"log-out"} size={35} color="black" />
						<Text style={[styles.text, { fontSize: 14 }]}>Log-out</Text>
					</TouchableOpacity>
					{/* </Link> */}
				</View>
			</View>
		</View>
	);
};

export default Profile;

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
		paddingHorizontal: 10,
	},
	header: {
		backgroundColor: "black",
		height: 60,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		color: "black",
		fontSize: 18,
		fontWeight: "bold",
		alignSelf: "flex-start",
	},
	button: {
		marginTop: 20,
		alignItems: "center",
		width: 100,
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: COLORS.primary,
		borderRadius: 10,
	},
});
