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
				tabBarShowLabel: false,
				tabBarActiveBackgroundColor: COLORS.lightPink,
				tabBarInactiveBackgroundColor: COLORS.pink,
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name="home/index"
				options={{
					tabBarIcon: ({ color }) => <Ionicons name={"home"} color={color} size={25} />,
				}}
			/>
			<Tabs.Screen
				name="service"
				options={{
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons name={"shovel"} color={color} size={25} />
					),
				}}
			/>
			<Tabs.Screen
				name="messaging"
				options={{
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons name={"message-processing"} color={color} size={25} />
					),
				}}
			/>
			<Tabs.Screen
				name="notifications/index"
				options={{
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons name={"bell-ring"} color={color} size={25} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile/index"
				options={{
					tabBarIcon: ({ color }) => <FontAwesome name={"user-circle-o"} color={color} size={25} />,
				}}
			/>
		</Tabs>
	);
}
