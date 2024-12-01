import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../../constants/Colors";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { savePushToken, UserStore } from "../../../store";
import { useStoreState } from "pullstate";
import { View, Text } from "react-native";
import { collection, query, where, onSnapshot, updateDoc, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../firebaseConfig";

export default function TabLayout() {
	const USER = useStoreState(UserStore);
	// Define a key for AsyncStorage
	const PERMISSIONS_REQUESTED_KEY = "permissionsRequested";

	// Check if permissions have already been requested
	async function havePermissionsBeenRequested() {
		try {
			const value = await AsyncStorage.getItem(PERMISSIONS_REQUESTED_KEY);
			return value !== null;
		} catch (error) {
			console.error("Error checking permissions requested:", error);
			return false;
		}
	}

	// Mark that permissions have been requested
	async function markPermissionsAsRequested() {
		try {
			await AsyncStorage.setItem(PERMISSIONS_REQUESTED_KEY, "true");
		} catch (error) {
			console.error("Error marking permissions as requested:", error);
		}
	}

	// Request permissions for notifications
	async function requestPermissions() {
		try {
			// Check if permissions have already been requested
			const permissionsRequested = await havePermissionsBeenRequested();

			if (!permissionsRequested) {
				const { status } = await Notifications.requestPermissionsAsync();

				if (status === "granted") {
					// Permission granted, proceed with notification setup
					Notifications.setNotificationHandler({
						handleNotification: async () => ({
							shouldShowAlert: true,
							shouldPlaySound: false,
							shouldSetBadge: false,
						}),
					});

					console.log("Notification permissions granted.");

					// Mark that permissions have been requested
					await markPermissionsAsRequested();
				} else {
					// Handle permission denial
					console.log("Failed to obtain notification permissions.");
					// Optionally provide a user-friendly explanation or prompt to try again
				}
			} else {
				console.log("Notification permissions have already been requested.");
			}
		} catch (error) {
			console.error("Error requesting notification permissions:", error);
		}
	}

	useEffect(() => {
		// Run requestPermissions only when the component mounts
		requestPermissions();
		savePushToken(USER.id);
	}, []);

	const [badgeCount, setBadgeCount] = useState(0);

	// Listener for notifications
	useEffect(() => {
		const notificationsRef = collection(FIRESTORE_DB, "notifications");
		const q = query(
			notificationsRef,
			where("seen", "==", false),
			where("to", "==", USER.id),
			where("deleted", "==", false)
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			setBadgeCount(snapshot.size); // Update badge count with the number of unseen notifications
		});

		return () => unsubscribe(); // Clean up the listener
	}, []);

	// Mark notifications as seen
	const markNotificationsAsSeen = async () => {
		if (badgeCount === 0) return;
		let count = 0;
		try {
			const notificationsRef = collection(FIRESTORE_DB, "notifications");
			const q = query(
				notificationsRef,
				where("seen", "==", false),
				where("to", "==", USER.id),
				where("type", "!=", "message"),
				where("deleted", "==", false)
			);

			const snapshot = await getDocs(q);
			snapshot.forEach(async (doc) => {
				await updateDoc(doc.ref, { seen: true });
				count++;
			});
		} catch (error) {
			console.error("Error marking notifications as seen:", error);
		}

		setBadgeCount(badgeCount - count); // Reset badge count
	};
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "black",
				tabBarInactiveTintColor: "black",
				tabBarShowLabel: true,
				tabBarActiveBackgroundColor: COLORS.lightPink,
				tabBarInactiveBackgroundColor: COLORS.pink,
				headerShown: false,
			}}
			screenListeners={{
				tabPress: (e) => {
					const parts = e.target.split("-");
					const result = parts[0];
					if (result === "notifications") {
						markNotificationsAsSeen();
					}
				},
			}}
		>
			<Tabs.Screen
				name="home/index"
				options={{
					tabBarIcon: ({ color }) => <Ionicons name={"home"} color={color} size={25} />,
					tabBarLabel: "Home",
				}}
			/>
			<Tabs.Screen
				name="service"
				options={{
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons name={"shovel"} color={color} size={25} />
					),
					tabBarLabel: "Services",
				}}
			/>
			<Tabs.Screen
				name="orders"
				options={{
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons name={"clipboard-text"} color={color} size={25} />
					),
					tabBarLabel: "Orders",
				}}
			/>
			<Tabs.Screen
				name="notifications"
				options={{
					tabBarIcon: ({ color }) => (
						<View style={{ position: "relative" }}>
							{/* Bell Icon */}
							<MaterialCommunityIcons name="bell-ring" color={color} size={25} />

							{/* Red Circle (Badge) */}
							{badgeCount > 0 && (
								<View
									style={{
										position: "absolute",
										top: -5,
										right: -5,
										backgroundColor: "red",
										borderRadius: 10,
										width: 16,
										height: 16,
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									{/* Badge Count */}
									<Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
										{badgeCount}
									</Text>
								</View>
							)}
						</View>
					),
					tabBarLabel: "Notifications",
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					tabBarIcon: ({ color }) => <FontAwesome name={"user-circle-o"} color={color} size={25} />,
					tabBarLabel: "Profile",
				}}
			/>
		</Tabs>
	);
}
