import { Timestamp } from "firebase-admin/firestore";

export type Apartment = {
	id: string;
	reviewRatingAverage: number;
	reviewsCount: number;
	lastScrape: Timestamp;
};
