import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { router, useLocalSearchParams } from "expo-router";
import { updatePaid } from "../../../../store";

export default function PaymentScreen() {
	const { checkoutUrl, orderID } = useLocalSearchParams();

	const handleNavigationStateChange = (navState) => {
		const { url } = navState;

		if (url.includes("facebook") || url.includes("google")) {
			router.replace("/orders");
		}
		if (url.includes("google")) {
			updatePaid(orderID);
		}
	};

	return (
		<View style={styles.container}>
			<WebView
				source={{ uri: checkoutUrl }}
				onNavigationStateChange={handleNavigationStateChange}
				startInLoadingState={true}
				javaScriptEnabled={true}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
