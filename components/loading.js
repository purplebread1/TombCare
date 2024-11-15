import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { COLORS } from "../constants/Colors";

const Loading = () => {
	return (
		<View style={styles.loadingOverlay}>
			<ActivityIndicator size="large" color={COLORS.primary} />
		</View>
	);
};

export default Loading;

const styles = StyleSheet.create({
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		zIndex: 99,
	},
});
