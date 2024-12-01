import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserStore } from "../store";
import { useStoreState } from "pullstate";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const USER = useStoreState(UserStore);
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Stack>
				<Stack.Screen name="(app)" options={{ headerShown: false }} />
				<Stack.Screen name="landing" options={{ headerShown: false }} />
				<Stack.Screen name="login" options={{ headerShown: false }} />
				<Stack.Screen name="signupform" options={{ headerShown: false }} />
				<Stack.Screen name="forgotpassword" options={{ headerShown: false }} />
			</Stack>
		</SafeAreaView>
	);
}
