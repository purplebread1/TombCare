import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { COLORS } from "../../../../constants/Colors";
import {
	collection,
	query,
	where,
	onSnapshot,
	orderBy,
	updateDoc,
	getDocs,
	doc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../../../../firebaseConfig";
import { useStoreState } from "pullstate";
import { UserStore } from "../../../../store";
import { router } from "expo-router";
import Loading from "../../../../components/loading";
import { AntDesign } from "@expo/vector-icons";

const Notifications = () => {
	const USER = useStoreState(UserStore);
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Fetch notifications in real-time
		const notificationsRef = collection(FIRESTORE_DB, "notifications");
		const q = query(
			notificationsRef,
			where("to", "==", USER.id),
			where("deleted", "==", false),
			orderBy("created", "desc")
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const notificationsData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			// Process notifications to group by transactionID for "message" type
			const groupedNotifications = processNotifications(notificationsData);
			setNotifications(groupedNotifications);
			setLoading(false);
		});

		return () => unsubscribe();
	}, [USER.id]);

	// Helper function to format Firestore Timestamp
	const formatDateTime = (timestamp) => {
		if (!timestamp) return "Unknown date";
		const date = timestamp.toDate();
		return new Intl.DateTimeFormat("en-US", {
			month: "2-digit",
			day: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		}).format(date);
	};

	// Group notifications by transactionID for "message" type
	const processNotifications = (notificationsData) => {
		const grouped = {};

		notificationsData.forEach((notif) => {
			if (notif.type === "message" && notif.transactionID) {
				if (!grouped[notif.transactionID]) {
					grouped[notif.transactionID] = {
						...notif,
						badgeCount: notif.seen ? 0 : 1,
					};
				} else {
					if (!notif.seen) {
						grouped[notif.transactionID].badgeCount += 1;
					}
				}
			} else {
				grouped[notif.id] = notif;
			}
		});

		// Convert grouped object back to array
		return Object.values(grouped);
	};

	// Mark all notifications for a transactionID as seen
	const markNotificationsAsSeen = async (transactionID) => {
		try {
			const notificationsRef = collection(FIRESTORE_DB, "notifications");
			const q = query(
				notificationsRef,
				where("transactionID", "==", transactionID),
				where("to", "==", USER.id),
				where("seen", "==", false),
				where("type", "==", "message"),
				where("deleted", "==", false)
			);

			const snapshot = await getDocs(q);
			const batchUpdates = []; // To keep track of async updates

			snapshot.forEach((doc) => {
				batchUpdates.push(updateDoc(doc.ref, { seen: true }));
			});

			await Promise.all(batchUpdates); // Ensure all updates complete

			// Update the local state to reset badgeCount for this transactionID
			setNotifications((prev) =>
				prev.map((notif) =>
					notif.transactionID === transactionID
						? { ...notif, badgeCount: 0 } // Reset badge count
						: notif
				)
			);

			// Navigate to the messaging screen
			router.push({
				pathname: "/notifications/messaging",
				params: { transactionId: transactionID },
			});
		} catch (error) {
			console.error("Error marking notifications as seen:", error);
		}
	};

	const deleteNotification = async (notificationID, transactionID, type) => {
		try {
			if (type === "message" && transactionID) {
				// Delete all "message" type notifications with the same transactionID
				const notificationsRef = collection(FIRESTORE_DB, "notifications");
				const q = query(
					notificationsRef,
					where("transactionID", "==", transactionID),
					where("to", "==", USER.id),
					where("type", "==", "message"),
					where("seen", "==", false),
					where("deleted", "==", false)
				);

				const snapshot = await getDocs(q);
				const batchUpdates = []; // Track all deletions

				snapshot.forEach((doc) => {
					batchUpdates.push(updateDoc(doc.ref, { deleted: true, seen: true }));
				});

				await Promise.all(batchUpdates);

				console.log(
					`All "message" notifications for transaction ${transactionID} marked as deleted.`
				);
			} else {
				// Delete a single notification (non-grouped or not type "message")
				const notificationRef = doc(FIRESTORE_DB, "notifications", notificationID);
				await updateDoc(notificationRef, { deleted: true });

				console.log(`Notification ${notificationID} marked as deleted.`);
			}

			// Update local state to remove the deleted notifications
			setNotifications((prev) =>
				prev.filter(
					(notif) =>
						!(notif.type === "message" && notif.transactionID === transactionID) &&
						notif.id !== notificationID
				)
			);
		} catch (error) {
			console.error("Error deleting notification:", error);
		}
	};

	const renderNotification = ({ item }) => {
		const isMessage = item.type === "message";
		const isService = item.type === "service";

		const NotificationContent = (
			<View style={styles.notificationContainer}>
				<TouchableOpacity
					onPress={() => deleteNotification(item.id, item.transactionID || null, item.type)}
					style={{
						position: "absolute",
						top: 5,
						right: 5,
						borderRadius: 10,

						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<AntDesign name="closecircle" size={16} color="black" />
				</TouchableOpacity>
				<View style={{ flexDirection: "row", alignItems: "center", columnGap: 5 }}>
					<Text style={styles.notificationTitle}>{item.title}</Text>
					{isMessage && item.badgeCount > 0 && (
						<View
							style={{
								backgroundColor: "red",
								borderRadius: 10,
								width: 20,
								height: 20,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							{/* Badge Count */}
							<Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
								{item.badgeCount}
							</Text>
						</View>
					)}
				</View>
				<Text style={styles.notificationBody}>{item.body}</Text>
				<Text style={styles.notificationDate}>{formatDateTime(item.created)}</Text>
			</View>
		);

		return isMessage ? (
			<TouchableOpacity onPress={() => markNotificationsAsSeen(item.transactionID)}>
				{NotificationContent}
			</TouchableOpacity>
		) : isService ? (
			<TouchableOpacity onPress={() => router.push("/orders")}>
				{NotificationContent}
			</TouchableOpacity>
		) : (
			<TouchableOpacity onPress={() => router.push("/profile")}>
				{NotificationContent}
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			<Image style={styles.eclipse} source={require("../../../../assets/images/eclipse.png")} />
			{/* Header */}
			<View style={styles.header}>
				<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Notifications</Text>
			</View>

			{loading ? (
				<Loading />
			) : (
				<View style={styles.innerContainer}>
					{notifications.length > 0 ? (
						<FlatList
							data={notifications}
							keyExtractor={(item) => item.id || item.transactionID}
							renderItem={renderNotification}
						/>
					) : (
						<Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}>
							No new notifications
						</Text>
					)}
				</View>
			)}
		</View>
	);
};

export default Notifications;

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLORS.background,
		flex: 1,
	},
	eclipse: {
		position: "absolute",
		top: -30,
		left: -50,
	},
	innerContainer: {
		flex: 1,
		paddingHorizontal: 10,
	},
	header: {
		backgroundColor: "black",
		height: 60,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	notificationContainer: {
		backgroundColor: COLORS.primary,
		padding: 15,
		marginBottom: 10,
		borderRadius: 10,
	},
	notificationTitle: {
		fontSize: 16,
		fontWeight: "bold",
	},
	notificationBody: {
		fontSize: 14,
	},
	notificationDate: {
		textAlign: "right",
		fontSize: 12,
		color: "white",
		marginTop: 5,
	},
});
