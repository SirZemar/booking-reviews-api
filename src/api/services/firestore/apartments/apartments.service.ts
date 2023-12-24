import { Timestamp, getFirestore } from "firebase-admin/firestore";
import { reviewsDataService } from "../reviews";
import { Apartment } from "../../../models";

const collection = "apartments";

export const addNewApartment = async (
	id: string,
	payload: Pick<Apartment, "name">
) => {
	const db = getFirestore();
	await db.collection(collection).doc(id).set({ id, name: payload.name });
};

export const patchApartment = async (
	id: string,
	payload: Partial<Apartment>
) => {
	const db = getFirestore();
	await db
		.collection(collection)
		.doc(id)
		.set({ id, name: payload.name }, { merge: true });
};

export const deleteApartment = async (id: string) => {
	const db = getFirestore();
	await db.collection(collection).doc(id).delete();
};

export const setLastReviewsScrape = async (id: string) => {
	const db = getFirestore();
	const lastReviewsScrape = Timestamp.now();

	await db
		.collection(collection)
		.doc(id)
		.set({ lastReviewsScrape }, { merge: true });
};

export const setReviewsCount = async (id: string) => {
	const db = getFirestore();

	const reviewsCountQuery = await reviewsDataService.reviewsCount(id);

	const reviewsCount = reviewsCountQuery.data().count;

	await db
		.collection(collection)
		.doc(id)
		.set({ reviewsCount }, { merge: true });
};

export const setReviewsRatingAverage = async (
	id: string,
	reviewsRatingAverage: number
) => {
	const db = getFirestore();

	// await db.collection(collection).doc(id).update({ reviewsAverage });
	await db
		.collection(collection)
		.doc(id)
		.set({ reviewsRatingAverage }, { merge: true });
};
