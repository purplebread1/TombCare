import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	FlatList,
	StyleSheet,
	Image,
	TouchableOpacity,
} from "react-native";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../../firebaseConfig";
import { UserStore } from "../../../../store";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useStoreState } from "pullstate";
import { COLORS } from "../../../../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MessagingScreen = () => {
	const USER = useStoreState(UserStore);
	const DEFAULT_PROFILE_PIC = require("../../../../assets/images/default-profile-pic.jpg");

	const { transactionId } = useLocalSearchParams(); // Passed transactionId to identify the room
	const [messages, setMessages] = useState([
		{
			id: "hgfhg",
			text: "hhgfhhhgfhgfhfghfghfgihhgfhgfhfhhhhgfhgfhfghfghfgihhgfhgfhfghfghfgigfhgfhfghfghfgihhgfhgfhfghfghfgighfghfgihhgfhgfhfghfghfgihhgfhgfhfghfghfgihhgfhgfhfghfghfgihhgfhgfhfghfghfgigfhfghfghfgi",
			user: "a959x598mlWcsPTIe8HzyYQuQHk2",
		},
		{
			id: "gdhghf",
			text: "hhgfhhhgfhgfhfghfghfgihhgfhgfhfhhhhgfhgfhfghfghfgihhgfhgfhfghfghfgigfhgfhfghfghfgihhgfhgfhfghfghfgighfghfgihhgfhgfhfghfghfgihhgfhgfhfghfghfgihhgfhgfhfghfghfgihhgfhgfhfghfghfgigfhfghfghfgi",
			user: "1",
		},
	]);
	const [text, setText] = useState("");

	// useEffect(() => {
	// 	if (!transactionId) {
	// 		console.error("No transaction ID available");
	// 		return;
	// 	}
	// 	// Fetch messages in real-time from the specific transaction's messages subcollection
	// 	const messagesRef = collection(FIRESTORE_DB, "transactions", transactionId, "messages");
	// 	const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"));

	// 	const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
	// 		const fetchedMessages = snapshot.docs.map((doc) => ({
	// 			id: doc.id,
	// 			...doc.data(),
	// 		}));
	// 		setMessages(fetchedMessages);
	// 	});

	// 	return () => unsubscribe();
	// }, [transactionId]);

	const sendMessage = async () => {
		if (text.trim().length === 0) return;

		try {
			const messagesRef = collection(FIRESTORE_DB, "transactions", transactionId, "messages");
			await addDoc(messagesRef, {
				text,
				createdAt: new Date(),
				user: USER.id,
			});
			setText(""); // Clear the input field
		} catch (error) {
			console.error("Error sending message: ", error);
		}
	};

	const renderMessage = ({ item }) => (
		<View
			style={[
				styles.messageContainer,
				item.user === USER.id ? styles.myMessage : styles.theirMessage,
			]}
		>
			<Text style={styles.messageText}>{item.text}</Text>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Image
					source={USER.profilePic ? { uri: USER.profilePic } : DEFAULT_PROFILE_PIC}
					style={{ height: 70, width: 70, borderRadius: 100 }}
				/>
				<View>
					<Text style={styles.text}>STATIC NAME</Text>
					<Text style={styles.text}>09123456789</Text>
				</View>
			</View>
			<FlatList
				data={messages}
				keyExtractor={(item) => item.id}
				renderItem={renderMessage}
				contentContainerStyle={styles.messagesList}
				inverted
				ListEmptyComponent={() => <Text>No messages yet...</Text>}
			/>
			<View style={styles.inputContainer}>
				<TextInput
					multiline
					style={styles.input}
					placeholder="Type a message..."
					value={text}
					onChangeText={setText}
				/>
				<TouchableOpacity onPress={sendMessage}>
					<MaterialCommunityIcons name="send" size={25} />
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLORS.ongoing,
		flex: 1,
	},
	eclipse: {
		position: "absolute",
		top: -30,
		left: -50,
	},
	header: {
		backgroundColor: "black",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		columnGap: 10,
		paddingVertical: 10,
		paddingLeft: 20,
	},
	text: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
		alignSelf: "flex-start",
	},
	messagesList: {
		backgroundColor: COLORS.ongoing,
		padding: 10,
	},
	messageContainer: {
		marginBottom: 10,
		padding: 10,
		borderRadius: 10,
		maxWidth: "80%",
	},
	myMessage: {
		backgroundColor: COLORS.completed,
		alignSelf: "flex-end",
	},
	theirMessage: {
		backgroundColor: COLORS.primary,
		alignSelf: "flex-start",
	},
	messageText: {
		color: "#fff",
	},
	inputContainer: {
		backgroundColor: "white",
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	input: {
		flex: 1,
		borderRadius: 5,
		marginRight: 10,
	},
});

export default MessagingScreen;
