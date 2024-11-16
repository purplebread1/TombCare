import { Tabs } from "expo-router";
import React from "react";
import { MaterialCommunityIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../../constants/Colors";

export default function TabLayout() {
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
