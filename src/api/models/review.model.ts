import { Timestamp } from "firebase-admin/firestore";

export type Review = {
	date: Timestamp;
	rate: number;
	id: string;
};

/**
 * The reviews exist in a raw format immediately after being scraped from a webpage, prior to any data manipulation.
 */
export type ReviewRaw = Omit<Review, "date"> & { date: string };