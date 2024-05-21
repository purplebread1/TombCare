import { View } from "react-native";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
	return <Redirect href="landing" />;
}
