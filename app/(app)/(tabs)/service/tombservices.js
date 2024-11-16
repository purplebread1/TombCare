import { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	Image,
	TouchableOpacity,
	TextInput,
	ScrollView,
} from "react-native";
import { COLORS } from "../../../../constants/Colors";
import { Link, router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { UserStore, fetchServices, addTransaction, fetchRecords } from "../../../../store";
import Dropdown from "../../../../components/dropdown";
import RequestBurial from "../../../../components/burialform";
import Loading from "../../../../components/loading";
import { useStoreState } from "pullstate";

const TombServices = () => {
	const USER = useStoreState(UserStore);
	const [loading, setLoading] = useState(false);
	const [services, setServices] = useState([]);
	const [records, setRecords] = useState([]);
	const [type, setType] = useState([]);
	const [transaction, setTransaction] = useState({
		userID: USER.id,
		serviceID: "",
		serviceName: "",
		amount: 0,
		status: "Pending",
		recordID: "",
		tombID: "",
		lotID: "",
		paid: false,
		additionalInstructions: "",
		types: [],
	});

	useEffect(() => {
		fetchTombServices();
		fetchAllRecords();
	}, []);

	useEffect(() => {
		console.log(transaction);
	}, [transaction]);

	const fetchTombServices = async () => {
		const res = await fetchServices("tomb");
		setServices(
			res.map((service) => ({
				...service,
				label: service.serviceName,
				value: service.id,
			}))
		);
		const maintenanceService = res.find((service) => service.serviceName === "Tomb Maintenance");
		setType(
			maintenanceService.types.map((type) => ({
				...type,
				pressed: false,
			}))
		);
	};

	const handleTypePress = (type) => {
		setType((prevTypes) =>
			prevTypes.map((item) =>
				item.name === type.name ? { ...item, pressed: !item.pressed } : item
			)
		);
		setTransaction((prevTransaction) => {
			const newTypes = type.pressed
				? prevTransaction.types.filter((t) => t.name !== type.name)
				: [...prevTransaction.types, { name: type.name, cost: type.cost }];

			return {
				...prevTransaction,
				amount: type.pressed
					? prevTransaction.amount - type.cost
					: prevTransaction.amount + type.cost,
				types: newTypes,
			};
		});
	};

	const fetchAllRecords = async () => {
		const res = await fetchRecords();
		setRecords(
			res.map((record) => ({
				...record,
				label: record.firstName + " " + record.middleName + " " + record.lastName,
				value: record.id,
			}))
		);
	};

	const handleOrderClick = async () => {
		if (
			!transaction.serviceID ||
			!transaction.serviceName ||
			!transaction.recordID ||
			transaction.amount === 0
		) {
			alert("Please fill out all fields!");
			return;
		}

		setLoading(true);

		try {
			const addTransactionSuccess = await addTransaction(transaction);

			if (addTransactionSuccess) {
				alert("Order successfully requested!");
				router.back();
			} else {
				throw new Error();
			}
		} catch (error) {
			alert("Failed to request order");
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			{loading && <Loading />}
			<Image style={styles.eclipse} source={require("../../../../assets/images/eclipse.png")} />
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()} style={{ position: "absolute", left: 10 }}>
					<AntDesign name={"left"} size={24} color="white" />
				</TouchableOpacity>
				<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Tomb Services</Text>
			</View>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.innerContainer}
			>
				<Dropdown
					data={records}
					label="Select Tomb"
					onSelect={(item) => {
						const selectedRecord = records.find((record) => record.value === item.value);
						setTransaction({
							...transaction,
							recordID: selectedRecord.id,
							tombID: selectedRecord.tombID,
						});
					}}
				/>
				{transaction.recordID !== "" && (
					<TextInput
						editable={false}
						style={[styles.input, { marginTop: 10, marginBottom: 0 }]}
						placeholderTextColor={"gray"}
					>
						Tomb ID: {records.find((record) => record.id === transaction.recordID)?.tombID}
					</TextInput>
				)}
				<Text style={{ ontSize: 16, fontWeight: "bold", marginVertical: 10 }}>
					Available Services
				</Text>
				<Dropdown
					data={services}
					label="Select Service"
					onSelect={(item) => {
						const selectedService = services.find((service) => service.value === item.value);
						setTransaction({
							...transaction,
							serviceID: item.value,
							amount: selectedService.cost,
							serviceName: selectedService.serviceName,
						});
					}}
				/>
				{transaction.serviceName === "Tomb Maintenance" && type.length > 0 && (
					<>
						<View style={styles.serviceContainer}>
							{type.slice(0, 2).map((type, index) => (
								<TouchableOpacity
									onPress={() => handleTypePress(type)}
									key={index}
									style={styles.typeButton}
								>
									<View style={styles.innerButton}>
										<View>
											<Text style={{ color: "black", fontWeight: "bold" }}>{type?.name}</Text>
											<Text style={{ color: "white" }}>₱{type?.cost?.toLocaleString()}</Text>
										</View>
										{type.pressed && <AntDesign name={"checkcircle"} size={20} color="black" />}
									</View>
								</TouchableOpacity>
							))}
						</View>
						<View style={styles.serviceContainer}>
							{type.slice(2).map((type, index) => (
								<TouchableOpacity
									onPress={() => handleTypePress(type)}
									key={index}
									style={styles.typeButton}
								>
									<View style={styles.innerButton}>
										<View>
											<Text style={{ color: "black", fontWeight: "bold" }}>{type.name}</Text>
											<Text style={{ color: "white" }}>₱{type?.cost?.toLocaleString()}</Text>
										</View>
										{type.pressed && <AntDesign name={"checkcircle"} size={20} color="black" />}
									</View>
								</TouchableOpacity>
							))}
						</View>
					</>
				)}
				<TextInput
					multiline
					textAlignVertical="top"
					style={styles.largeInput}
					placeholder="Enter Additional Instruction"
					placeholderTextColor={"gray"}
					value={transaction.additionalInstructions}
					onChangeText={(text) => setTransaction({ ...transaction, additionalInstructions: text })}
				/>
				<Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}>
					Total Amount: ₱{transaction?.amount?.toLocaleString()}
				</Text>
				<TouchableOpacity style={styles.button} onPress={handleOrderClick}>
					<Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Order</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};

export default TombServices;

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
		paddingHorizontal: 25,
		paddingVertical: 20,
	},
	header: {
		backgroundColor: "black",
		height: 60,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	input: {
		marginBottom: 20,
		padding: 10,
		backgroundColor: "white",
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 8,
	},
	largeInput: {
		width: "100%",
		height: 200,
		paddingHorizontal: 10,
		paddingTop: 10,
		backgroundColor: "white",
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 8,
		marginTop: 20,
	},
	button: {
		alignSelf: "center",
		alignItems: "center",
		width: 100,
		marginTop: 50,
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: COLORS.primary,
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 10,
	},
	serviceContainer: {
		marginTop: 10,
		flexDirection: "row",
		columnGap: 10,
	},
	typeButton: {
		flex: 1,
		padding: 10,
		backgroundColor: COLORS.primary,
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 10,
	},
	innerButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
});
