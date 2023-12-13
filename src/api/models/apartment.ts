import { Timestamp } from "firebase-admin/firestore";

export type Apartment = {
	id: string;
	reviewRateAverage: number;
	reviewsCount: number;
	lastScrape: Timestamp;
};
