import React, { useEffect, useState, useRef } from "react";

import { View, StyleSheet, Text, TouchableOpacity, TextInput, Dimensions } from "react-native";
import { COLORS } from "../../../../constants/Colors";
import { Ionicons, MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
import AddRecord from "../../../../components/addrecord";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../../firebaseConfig";
import Mapbox, { MapView, Camera, FillLayer, VectorSource, UserLocation } from "@rnmapbox/maps";
import { LocationStore } from "../../../../store";
import { useStoreState } from "pullstate";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");

Mapbox.setAccessToken(
	"pk.eyJ1IjoiYW1hcmlsbG9zaGlubGVlIiwiYSI6ImNtMW5mdHpkeDB2ZzUyanF4ZTg5dWF0eGQifQ.4u_01jtvmOf7x573iMqFUg"
);
const Home = () => {
	const USER_LOCATION = useStoreState(LocationStore);
	const CEMPARK_LOCATION = [123.9162, 10.33889];
	const [selectedLotID, setSelectedLotID] = useState(null);
	const [openForm, setOpenForm] = useState(false);
	const [tombs, setTombs] = useState([]);
	const [search, setSearch] = useState("");
	const [location, setLocation] = useState([]);

	const mapRef = useRef(null);
	const cameraRef = useRef(null);

	useEffect(() => {
		async function getCurrentLocation() {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				setErrorMsg("Permission to access location was denied");
				return;
			}
		}

		getCurrentLocation();
		Mapbox.setTelemetryEnabled(false);
	}, []);

	const handleMapLoad = async () => {
		if (mapRef.current) {
			// try {
			// 	const layers = ["tombs-layer-1", "tombs-layer-2"];
			// 	// Fetch features from specified layers
			// 	const features = await mapRef?.current?.features(layers, []);
			// 	console.log("Fetched Features: ", features);
			// } catch (error) {
			// 	console.error("Error fetching features: ", error);
			// }
		}
	};
	useEffect(() => {
		const recordsRef = collection(FIRESTORE_DB, "records");
		const q = query(recordsRef, where("approved", "==", true), where("privacy", "==", "Public"));

		const unsubscribe = onSnapshot(
			q,
			(querySnapshot) => {
				const updatedTombs = [];
				querySnapshot.forEach((doc) => {
					updatedTombs.push({ id: doc.id, ...doc.data() });
				});
				setTombs(updatedTombs);
			},
			(error) => {
				console.error("Error fetching tombs:", error);
			}
		);

		// Cleanup subscription on unmount
		return () => unsubscribe();
	}, []);

	const handlePress = (e) => {
		const feature = e.features[0];
		const lotID = feature.properties.LotID;
		setSelectedLotID(lotID);
		console.log(lotID);
	};

	const handleSearch = () => {
		const tomb = tombs.find((tomb) => tomb.tombID === search);
		if (!tomb?.tombID && !tomb?.lotID) {
			alert("Tomb not found!");
			return;
		}
		setSelectedLotID(tomb?.lotID);
	};

	const handleFlyToCemetery = () => {
		cameraRef.current?.setCamera({
			centerCoordinate: CEMPARK_LOCATION,
			zoomLevel: 17,
			animationMode: "flyTo",
			animationDuration: 1000,
		});
	};

	const handleFlyToCurrentLocation = () => {
		cameraRef.current?.setCamera({
			centerCoordinate: [USER_LOCATION.longitude, USER_LOCATION.latitude],
			zoomLevel: 17,
			animationMode: "flyTo",
			animationDuration: 1000,
		});
	};

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Welcome</Text>
			<View style={styles.innerContainer}>
				{selectedLotID && (
					<TouchableOpacity
						style={{ position: "absolute", top: 10, right: 10, zIndex: 200 }}
						onPress={() => setOpenForm(!openForm)}
					>
						<Ionicons name="add-circle" size={55} color={COLORS.primary} />
					</TouchableOpacity>
				)}

				<TouchableOpacity
					style={{
						position: "absolute",
						top: 30,
						left: 10,
						zIndex: 200,
						backgroundColor: COLORS.primary,
						padding: 10,
						borderRadius: 100,
					}}
					onPress={handleFlyToCemetery}
				>
					<MaterialCommunityIcons name="grave-stone" size={20} color="white" />
				</TouchableOpacity>

				<TouchableOpacity
					style={{
						position: "absolute",
						top: 80,
						left: 10,
						zIndex: 200,
						backgroundColor: COLORS.primary,
						paddingVertical: 10,
						paddingHorizontal: 14,
						borderRadius: 100,
					}}
					onPress={handleFlyToCurrentLocation}
				>
					<FontAwesome6 name="person" size={18} color="white" />
				</TouchableOpacity>

				{openForm && (
					<AddRecord lotID={selectedLotID} openForm={openForm} setOpenForm={setOpenForm} />
				)}
				<View style={styles.page}>
					<View style={styles.mapContainer}>
						<MapView
							ref={mapRef}
							style={styles.map}
							onPress={() => setSelectedLotID(null)}
							onDidFinishLoadingMap={handleMapLoad}
						>
							<Camera
								ref={cameraRef}
								centerCoordinate={CEMPARK_LOCATION}
								zoomLevel={17}
								animationMode="flyTo"
								animationDuration={1000}
							/>
							<UserLocation
								androidRenderMode="compass"
								requestsAlwaysUse={true}
								visible={true}
								showsUserHeadingIndicator={true}
								onUpdate={(location) => {
									const { latitude, longitude } = location.coords;
									LocationStore.update((s) => {
										s.latitude = latitude;
										s.longitude = longitude;
									});
								}}
							/>

							{/* Tombs Layer with filter */}
							<VectorSource
								id="tombs-source-1"
								url="mapbox://amarilloshinlee.bxjanlwp"
								onPress={handlePress}
							>
								<FillLayer
									id="tombs-layer-1"
									sourceID="tombs-source-1"
									sourceLayerID="Tombs_Export-3wapss"
									filter={selectedLotID ? ["==", ["get", "LotID"], selectedLotID] : null}
									style={{
										fillColor: selectedLotID ? "red" : "#000000",
										fillOpacity: selectedLotID ? 1 : 0.7,
									}}
								/>
							</VectorSource>

							{/* Default Tombs Layer (non-clicked) */}
							<VectorSource id="tombs-source-2" url="mapbox://amarilloshinlee.bxjanlwp">
								<FillLayer
									id="tombs-layer-2"
									sourceID="tombs-source-2"
									sourceLayerID="Tombs_Export-3wapss"
									style={{
										fillColor: "green",
										fillOpacity: 0.7,
										fillOutlineColor: "white",
									}}
								/>
							</VectorSource>
						</MapView>
					</View>
				</View>
				<View style={styles.input}>
					<TextInput
						style={{ color: "white", flex: 1, marginRight: 5 }}
						placeholder="Search Tomb"
						placeholderTextColor="white"
						value={search}
						onChangeText={setSearch}
					/>
					<TouchableOpacity onPress={handleSearch}>
						<Ionicons name={"search-outline"} size={24} color="black" />
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};
export default Home;

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
		alignItems: "center",
	},
	text: {
		marginVertical: 10,
		textAlign: "center",
		fontWeight: "bold",
		color: "black",
		fontSize: 20,
	},
	input: {
		position: "absolute",
		bottom: 50,
		flexDirection: "row",
		marginTop: 50,
		width: 180,
		paddingHorizontal: 15,
		paddingVertical: 10,
		backgroundColor: COLORS.primary,
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 15,
		alignItems: "center",
		justifyContent: "space-between",
	},

	page: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F5FCFF",
	},
	mapContainer: {
		height: height - 95,
		width: width,
	},
	map: {
		flex: 1,
	},
});
