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
import {
	collection,
	addDoc,
	query,
	orderBy,
	onSnapshot,
	getDocs,
	getDoc,
	doc,
	where,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../../../../firebaseConfig";
import { UserStore } from "../../../../store";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useStoreState } from "pullstate";
import { COLORS } from "../../../../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Loading from "../../../../components/loading";

const MessagingScreen = () => {
	const USER = useStoreState(UserStore);
	const DEFAULT_PROFILE_PIC = require("../../../../assets/images/default-profile-pic.jpg");

	const { transactionId } = useLocalSearchParams(); // Passed transactionId to identify the room
	const [messages, setMessages] = useState([]);
	const [text, setText] = useState("");
	const [worker, setWorker] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!transactionId) {
			return;
		}
		const fetchUser = async () => {
			const transactionRef = doc(FIRESTORE_DB, "transactions", transactionId);
			const transactionDoc = await getDoc(transactionRef);
			const workerID = transactionDoc.data()?.workerID;

			if (!workerID) {
				console.error("No worker ID found in the transaction");
				return;
			}

			// Query users collection where uid matches workerID
			const usersRef = collection(FIRESTORE_DB, "users");
			const usersQuery = query(usersRef, where("uid", "==", workerID));

			try {
				const querySnapshot = await getDocs(usersQuery);
				if (!querySnapshot.empty) {
					const userDoc = querySnapshot.docs[0];
					setWorker(userDoc.data() || {});
					console.log("Fetched user data:", userDoc.data());
				} else {
					console.error("User not found");
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
			setLoading(false);
		};

		fetchUser();
	}, []);

	useEffect(() => {
		if (!transactionId) {
			console.error("No transaction ID available");
			return;
		}

		// Fetch messages in real-time from the specific transaction's messages subcollection
		const messagesRef = collection(FIRESTORE_DB, "transactions", transactionId, "messages");
		const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"));

		const unsubscribe = onSnapshot(
			messagesQuery,
			(snapshot) => {
				const fetchedMessages = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setMessages(fetchedMessages);
			},
			(error) => {
				console.error("Error fetching messages:", error);
			}
		);

		// Cleanup on unmount or transactionId change
		return () => unsubscribe();
	}, [transactionId]);

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
			{loading ? (
				<Loading />
			) : (
				<>
					<View style={styles.header}>
						<Image
							source={worker?.profilePic ? { uri: worker?.profilePic } : DEFAULT_PROFILE_PIC}
							style={{ height: 70, width: 70, borderRadius: 100 }}
						/>
						<View>
							<Text style={styles.text}>{worker?.fullname}</Text>
							<Text style={styles.text}>{worker?.phoneNumber}</Text>
						</View>
					</View>
					<FlatList
						data={messages}
						keyExtractor={(item) => item.id}
						renderItem={renderMessage}
						contentContainerStyle={styles.messagesList}
						inverted
					/>
					{messages.length === 0 && (
						<Text
							style={{ color: "white", fontWeight: "bold", textAlign: "center", marginBottom: 20 }}
						>
							No messages yet...
						</Text>
					)}
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
				</>
			)}
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
