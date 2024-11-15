import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { COLORS } from "../../../../constants/Colors";
import { Link, router } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { UserStore, signOutUser } from "../../../../store";
import { useStoreState } from "pullstate";

const Profile = () => {
	const USER = useStoreState(UserStore);
	const DEFAULT_PROFILE_PIC = require("../../../../assets/images/default-profile-pic.jpg");

	const handleLogout = async () => {
		await signOutUser();
		router.replace("/login");
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
						<Image
							source={USER.profilePic ? { uri: USER.profilePic } : DEFAULT_PROFILE_PIC}
							style={{ height: 100, width: 100, borderRadius: 100 }}
						/>
						<View>
							<Text style={styles.text}>
								{USER.firstName} {USER.lastName}
							</Text>
							<Text style={styles.text}>{USER.mobileNumber}</Text>
							<Text style={styles.text}>{USER.email}</Text>
						</View>
					</View>
					<Link href="/profile/edit" asChild>
						<TouchableOpacity style={styles.button}>
							<Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>Edit Profile</Text>
						</TouchableOpacity>
					</Link>
				</View>
				<View style={styles.addressContainer}>
					<Text style={[styles.text, { fontSize: 20 }]}>Address:</Text>
					<Text style={styles.text}>{USER.address}</Text>
				</View>
				<View style={{ flex: 1, width: "100%", alignItems: "center" }}>
					<TouchableOpacity style={{ alignItems: "center" }} onPress={handleLogout}>
						<Entypo name={"log-out"} size={35} color="black" />
						<Text style={[styles.text, { fontSize: 14 }]}>Log-out</Text>
					</TouchableOpacity>
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
	addressContainer: {
		flex: 2,
		width: "100%",
		padding: 10,
		marginVertical: 30,
		backgroundColor: "white",
		borderRadius: 10,
	},
});
