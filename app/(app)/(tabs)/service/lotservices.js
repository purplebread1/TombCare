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
import { UserStore, fetchServices, addTransaction, addRecord } from "../../../../store";
import Dropdown from "../../../../components/dropdown";
import RequestBurial from "../../../../components/burialform";
import Loading from "../../../../components/loading";
import { useStoreState } from "pullstate";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { FIREBASE_STORAGE } from "../../../../firebaseConfig";

const LotServices = () => {
	const USER = useStoreState(UserStore);
	const [loading, setLoading] = useState(false);
	const [services, setServices] = useState([]);
	const [record, setRecord] = useState({}); // For request burial
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
		fetchLotServices();
	}, []);

	const fetchLotServices = async () => {
		const res = await fetchServices("lot");
		setServices(
			res.map((service) => ({
				...service,
				label: service.serviceName,
				value: service.id,
			}))
		);
	};

	const handleBurialForm = (data, deathCertImage) => {
		setRecord({ ...data, deathCertificate: deathCertImage || "" });
		console.log("Received formData:", {
			...data,
			deathCertificate: deathCertImage ? deathCertImage : "",
		});
	};

	const handleOrderClick = async () => {
		if (!transaction.serviceID || !transaction.serviceName || !transaction.lotID) {
			alert("Please fill out all fields!");
			return;
		}

		if (
			transaction.serviceName === "Request Burial" &&
			record &&
			Object.entries(record).some(([key, value]) => {
				if (key !== "approved" && key !== "middleName") {
					return value === "" || value == null;
				}
				return false;
			})
		) {
			alert("Please fill out the burial form!");
			return;
		}
		setLoading(true);

		try {
			let addTransactionSuccess = false;
			if (transaction.serviceName === "Request Burial") {
				// Upload the death certificate image if provided
				let deathCertificateURL = "";
				if (record.deathCertificate?.uri) {
					console.log("here!");
					try {
						deathCertificateURL = await uploadImage(record.deathCertificate.uri, record.lastName);
					} catch (error) {
						alert("Failed to upload death certificate.");
						console.error(error);
						setLoading(false);
						return;
					}
				}

				// Trim all string fields in record
				const trimmedFormData = Object.fromEntries(
					Object.entries(record).map(([key, value]) => [
						key,
						typeof value === "string" ? value.trim() : value,
					])
				);

				// Update record with the uploaded URL
				const updatedRecord = {
					...trimmedFormData,
					lotID: transaction.lotID,
					tombID: "", // assigned by management
					deathCertificate: deathCertificateURL,
					registeredBy: USER.id,
				};

				// Add the burial record and get the record ID
				const recordId = await addRecord(updatedRecord);
				if (!recordId) throw new Error();

				addTransactionSuccess = await addTransaction({ ...transaction, recordID: recordId });
			} else {
				addTransactionSuccess = await addTransaction(transaction);
			}

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

	const uploadImage = async (uri, lastName) => {
		const blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function (e) {
				console.log(e);
				reject(new TypeError("Network request failed"));
			};
			xhr.responseType = "blob";
			xhr.open("GET", uri, true);
			xhr.send(null);
		});

		if (!blob) {
			throw new Error("Blob conversion failed.");
		}

		const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
		const filename = "Records/" + lastName + uniqueId;
		const storageRef = ref(FIREBASE_STORAGE, filename);

		// const uploadTask = uploadBytesResumable(storageRef, blob);
		await uploadBytes(storageRef, blob);

		// We're done with the blob, close and release it
		blob.close();

		return await getDownloadURL(storageRef);
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
				<Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Lot Services</Text>
			</View>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.innerContainer}
			>
				<TextInput
					style={styles.input}
					placeholder="Enter Lot ID"
					placeholderTextColor={"gray"}
					value={transaction.lotID}
					onChangeText={(text) => setTransaction({ ...transaction, lotID: text })}
				/>
				<Text style={{ ontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
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
				{transaction.serviceName === "Request Burial" && (
					<RequestBurial onFormDataChange={handleBurialForm} />
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

export default LotServices;

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
});
