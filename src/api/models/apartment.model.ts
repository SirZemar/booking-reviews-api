import { Timestamp } from "firebase-admin/firestore";
import { Review } from "./review.model";

export type Apartment = {
	id: string;
	reviewsRatingAverage: number;
	reviewsCount: number;
	lastReviewsScrape: Timestamp;
	reviews: Review[];
	name: string;
};