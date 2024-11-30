import { Tabs } from "expo-router";
import { useEffect } from "react";
import { MaterialCommunityIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../../constants/Colors";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabLayout() {
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
	}, []);
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
				name="notifications/index"
				options={{
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons name={"bell-ring"} color={color} size={25} />
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
