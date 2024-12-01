import { View, StyleSheet, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { COLORS } from "../../../../constants/Colors";
import { Link, router } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { UserStore, signOutUser } from "../../../../store";
import { useStoreState } from "pullstate";
import Loading from "../../../../components/loading";
import { useEffect, useState } from "react";
import { fetchRegisteredTombs } from "../../../../store";
import * as Clipboard from "expo-clipboard";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../../firebaseConfig";

const Profile = () => {
	const USER = useStoreState(UserStore);
	const DEFAULT_PROFILE_PIC = require("../../../../assets/images/default-profile-pic.jpg");
	const [registeredTombs, setRegisteredTombs] = useState([]);
	const [loading, setLoading] = useState(true);

	const copyToClipboard = async (id) => {
		await Clipboard.setStringAsync(id);
	};

	useEffect(() => {
		if (USER.id) {
			setLoading(true);

			const recordsRef = collection(FIRESTORE_DB, "records");
			const q = query(
				recordsRef,
				where("approved", "==", true),
				where("privacy", "==", "Public"),
				where("registeredBy", "==", USER.id),
				orderBy("firstName")
			);

			const unsubscribe = onSnapshot(
				q,
				(querySnapshot) => {
					const records = [];
					querySnapshot.forEach((doc) => {
						records.push({ id: doc.id, ...doc.data() });
					});
					setRegisteredTombs(records);
					setLoading(false);
				},
				(error) => {
					console.error("Error fetching records:", error);
					alert("Failed to fetch records!");
					setLoading(false);
				}
			);

			// Cleanup the listener on unmount
			return () => unsubscribe();
		}
	}, []);

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
			{!USER?.id && loading ? (
				<Loading />
			) : (
				<View style={styles.innerContainer}>
					<View style={{ width: "100%", padding: 10 }}>
						<View style={{ flexDirection: "row", alignItems: "center", columnGap: 10 }}>
							<Image
								source={USER.profilePic ? { uri: USER.profilePic } : DEFAULT_PROFILE_PIC}
								style={{ height: 100, width: 100, borderRadius: 100 }}
							/>
							<View style={{ flex: 1 }}>
								<Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
									{USER.firstName} {USER.lastName}
								</Text>
								<Text style={styles.text}>{USER.mobileNumber || "No number set"}</Text>
								<Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
									{USER.email}
								</Text>
							</View>
						</View>
						<Link href="/profile/edit" asChild>
							<TouchableOpacity style={styles.button}>
								<Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>
									Edit Profile
								</Text>
							</TouchableOpacity>
						</Link>
					</View>
					<View style={styles.addressContainer}>
						<Text style={[styles.text, { fontSize: 20 }]}>Address:</Text>
						<Text style={styles.text}>{USER.address || "No address set"}</Text>
						<Text style={[styles.text, { fontSize: 20, marginTop: 20, marginBottom: 10 }]}>
							Registered Tombs:
						</Text>
						<FlatList
							showsVerticalScrollIndicator={false}
							data={registeredTombs}
							renderItem={({ item }) => (
								<View
									style={{
										marginBottom: 10,
										backgroundColor: COLORS.primary,
										padding: 10,
										borderRadius: 10,
									}}
								>
									<Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
										{item?.firstName || ""}
										{item?.middleName ? ` ${item.middleName}` : ""}
										{item?.lastName ? ` ${item.lastName}` : ""}
									</Text>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "space-between",
										}}
									>
										<Text>Tomb ID:{item.tombID}</Text>
										<TouchableOpacity onPress={() => copyToClipboard(item.tombID)}>
											<Entypo name={"clipboard"} size={18} color="black" />
										</TouchableOpacity>
									</View>
								</View>
							)}
							keyExtractor={(item) => item.id}
							style={{ width: "100%" }}
						/>
					</View>
					<View style={{ width: "100%", alignItems: "center", paddingBottom: 20 }}>
						<TouchableOpacity style={{ alignItems: "center" }} onPress={handleLogout}>
							<Entypo name={"log-out"} size={35} color="black" />
							<Text style={[styles.text, { fontSize: 14 }]}>Log-out</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
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
		width: "100%",
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
		flex: 1,
		width: "100%",
		padding: 10,
		marginVertical: 30,
		backgroundColor: "white",
		borderRadius: 10,
	},
});
