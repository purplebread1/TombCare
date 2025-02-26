import { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	Image,
	TouchableOpacity,
	ScrollView,
	RefreshControl,
	ActivityIndicator,
	Linking,
} from "react-native";
import { COLORS } from "../../../../constants/Colors";
import { useStoreState } from "pullstate";
import { UserStore } from "../../../../store";
import { FIRESTORE_DB } from "../../../../firebaseConfig";
import { collection, query, where, orderBy, onSnapshot, getDocs } from "firebase/firestore";
import { Link, router } from "expo-router";
import Loading from "../../../../components/loading";

const Orders = () => {
	const USER = useStoreState(UserStore);

	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	// Fetch orders with a real-time listener
	useEffect(() => {
		const transactionRef = collection(FIRESTORE_DB, "transactions");
		const q = query(transactionRef, where("userID", "==", USER.id), orderBy("created", "desc"));

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const updatedOrders = [];
				snapshot.forEach((doc) => {
					updatedOrders.push({ id: doc.id, ...doc.data() });
				});
				setOrders(updatedOrders);
				setLoading(false);
			},
			(error) => {
				console.error("Error listening to Firestore:", error);
				alert("Failed to listen to order updates!");
			}
		);

		// Clean up listener on unmount
		return () => unsubscribe();
	}, [USER.id]);

	// Pull-to-refresh handler
	const onRefresh = async () => {
		setRefreshing(true);
		try {
			// Optionally refetch data manually for consistency
			const transactionRef = collection(FIRESTORE_DB, "transactions");
			const q = query(transactionRef, where("userID", "==", USER.id), orderBy("created", "desc"));
			const snapshot = await getDocs(q);

			const refreshedOrders = [];
			snapshot.forEach((doc) => {
				refreshedOrders.push({ id: doc.id, ...doc.data() });
			});

			setOrders(refreshedOrders);
		} catch (error) {
			console.error("Error refreshing orders:", error);
		} finally {
			setRefreshing(false);
		}
	};

	const handlePayment = async (order) => {
		const total = order.amount.toString() + "00";
		const options = {
			method: "POST",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
				authorization: "Basic c2tfdGVzdF9DY1FBTFBhS3BtSmF2R2hVTExhd3FQckY6",
			},
			body: JSON.stringify({
				data: {
					attributes: {
						billing: {
							name: USER.firstName + " " + USER.lastName,
							email: USER.email,
						},
						send_email_receipt: false,
						show_line_items: true,
						line_items: [
							{ amount: Number(total), currency: "PHP", name: order.serviceName, quantity: 1 },
						],
						payment_method_types: ["gcash", "paymaya"],
						success_url: "https://www.google.com",
						cancel_url: "https://www.facebook.com",
					},
				},
			}),
		};

		fetch("https://api.paymongo.com/v1/checkout_sessions", options)
			.then((res) => res.json())
			.then((res) => {
				if (res.data && res.data.attributes && res.data.attributes.checkout_url) {
					const checkoutUrl = res.data.attributes.checkout_url;
					// Navigate to PaymentScreen with checkout URL
					if (checkoutUrl) {
						router.push({
							pathname: "/orders/payment",
							params: { checkoutUrl: checkoutUrl, orderID: order.id },
						});
					}
				}
			})
			.catch((err) => console.error("Error creating checkout session:", err));
	};

	const Services = () => (
		<View style={styles.serviceContainer}>
			{orders.map((order, index) => (
				<View key={index} style={styles.button}>
					{order.status !== "Pending" && (
						<Link
							key={index}
							href={{
								pathname: "/orders/messaging",
								params: { transactionId: order.id },
							}}
							asChild
						>
							<TouchableOpacity
								style={{
									position: "absolute",
									top: 10,
									right: 20,
									zIndex: 10,
								}}
							>
								<Text style={{ color: COLORS.neongreen, fontWeight: "bold" }}>Message</Text>
							</TouchableOpacity>
						</Link>
					)}
					{order.status === "Completed" && (
						<>
							{order.paid ? (
								<Text
									style={[
										styles.completed,
										{ color: COLORS.ongoing, fontWeight: "bold", fontSize: 15 },
									]}
								>
									Paid
								</Text>
							) : (
								<TouchableOpacity onPress={() => handlePayment(order)} style={styles.completed}>
									<Text style={{ color: COLORS.neongreen, fontWeight: "bold", fontSize: 15 }}>
										Go to Payment
									</Text>
								</TouchableOpacity>
							)}
						</>
					)}
					<Text style={{ fontSize: 18 }}>{order.serviceName}</Text>
					{order?.tombID && <Text style={{ fontSize: 18 }}>Tomb ID: {order.tombID}</Text>}
					{order?.lotID && <Text style={{ fontSize: 18 }}>Lot ID: {order.lotID}</Text>}
					{order?.types?.length > 0 && (
						<Text style={{ fontSize: 18 }}>
							Types: {order.types.map((type) => type.name).join(", ")}
						</Text>
					)}
					<View
						style={{
							backgroundColor: order.status === "Completed" ? COLORS.completed : COLORS.ongoing,
							padding: 5,
							marginTop: 20,
							width: 100,
							borderRadius: 50,
							alignItems: "center",
							alignSelf: "flex-end",
						}}
					>
						<Text style={{ color: "white" }}>{order.status}</Text>
					</View>
				</View>
			))}
		</View>
	);

	return (
		<View style={styles.container}>
			<Image style={styles.eclipse} source={require("../../../../assets/images/eclipse.png")} />
			{/* Header */}
			<View style={styles.header}>
				<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Your Orders</Text>
			</View>
			{loading && <Loading />}
			{/* Content */}
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.innerContainer}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			>
				{!loading && orders.length === 0 ? (
					<Text
						style={{
							fontSize: 18,
							fontWeight: "bold",
							textAlign: "center",
							marginTop: 50,
						}}
					>
						No orders found
					</Text>
				) : (
					<Services />
				)}
			</ScrollView>
		</View>
	);
};

export default Orders;

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
		paddingHorizontal: 15,
		paddingVertical: 20,
	},
	header: {
		backgroundColor: "black",
		height: 60,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	serviceContainer: {
		rowGap: 10,
	},
	button: {
		width: "100%",
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: COLORS.primary,
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 10,
	},
	text: {
		color: "black",
		fontSize: 18,
		fontWeight: "bold",
		alignSelf: "flex-start",
		marginBottom: 20,
	},
	completed: {
		position: "absolute",
		bottom: 10,
		left: 10,
		zIndex: 10,
	},
});
