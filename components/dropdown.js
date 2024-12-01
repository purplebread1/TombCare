import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const CustomDropdown = ({ data, label, onSelect, existingValue }) => {
	const [value, setValue] = useState(existingValue || data[0]);
	const [isFocus, setIsFocus] = useState(false);

	//   useEffect(() => {
	//     // Set the initial value based on the existingValue prop
	//     if (existingValue) {
	//       console.log("exisiting value", existingValue)
	//       setValue(existingValue);
	//     } else {
	//       setValue(data[0]);
	//     }
	//   }, []);

	return (
		<Dropdown
			style={styles.dropdown}
			placeholderStyle={styles.placeholderStyle}
			selectedTextStyle={styles.selectedTextStyle}
			itemTextStyle={styles.itemTextStyle}
			iconStyle={styles.iconStyle}
			data={data}
			maxHeight={300}
			labelField="label"
			valueField="value"
			placeholder={!isFocus ? (existingValue ? existingValue : label) : "..."}
			value={value}
			onFocus={() => {
				setIsFocus(true);
			}}
			onBlur={() => setIsFocus(false)}
			onChange={(item) => {
				setValue(item.value);
				setIsFocus(false);
				onSelect(item);
			}}
			search
			searchPlaceholder="Search..."
			inputSearchStyle={{ fontSize: 14 }}
		/>
	);
};

export default CustomDropdown;

const styles = StyleSheet.create({
	dropdown: {
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 5,
		backgroundColor: "white",
		padding: 10,
	},
	placeholderStyle: {
		fontSize: 14,
	},
	selectedTextStyle: {
		fontSize: 14,
	},
	itemTextStyle: {
		fontSize: 14,
	},
});
