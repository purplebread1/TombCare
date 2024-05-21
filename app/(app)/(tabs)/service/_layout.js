import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { UserStore } from "../../../../store";
import { useStoreState } from "pullstate";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const VisitorStack = () => {
	return (
		<Stack>
			<Stack.Screen name="select" options={{ headerShown: false }} />
			<Stack.Screen name="maintenance" options={{ headerShown: false }} />
			<Stack.Screen name="excavation" options={{ headerShown: false }} />
			<Stack.Screen name="constructdig" options={{ headerShown: false }} />
			<Stack.Screen name="orderconfirm" options={{ headerShown: false }} />
			<Stack.Screen name="orders" options={{ headerShown: false }} />
			<Stack.Screen name="requestburial" options={{ headerShown: false }} />
		</Stack>
	);
};

const WorkerStack = () => {
	return (
		<Stack>
			<Stack.Screen name="servicehub" options={{ headerShown: false }} />
			<Stack.Screen name="requestdetails" options={{ headerShown: false }} />
		</Stack>
	);
};

export default function ServiceLayout() {
	const USER = useStoreState(UserStore);

	return USER.type === "Cemetery Visitor" ? <VisitorStack /> : <WorkerStack />;
}
