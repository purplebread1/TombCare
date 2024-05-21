import { Ionicons } from "@expo/vector-icons";

const Rating = ({ rating, size, color = "gold", total = 5 }) => {
	const FULL_STAR = Math.floor(rating);
	const HAS_HALF_STAR = rating % 1 !== 0;
	const REMAINING_STAR = HAS_HALF_STAR
		? total - Math.floor(rating) - 1
		: total - Math.floor(rating);

	const stars = [];
	for (let i = 0; i < FULL_STAR; i++) {
		stars.push(<Ionicons key={i} name="star" size={size} color={color} />);
	}
	if (HAS_HALF_STAR) {
		stars.push(<Ionicons key="half-star" name="star-half" size={size} color={color} />);
	}
	if (stars.length !== total) {
		for (let i = 0; i < REMAINING_STAR; i++) {
			stars.push(<Ionicons key={stars.length + i} name="star" size={size} color={color} />);
		}
	}

	return stars;
};

export default Rating;
