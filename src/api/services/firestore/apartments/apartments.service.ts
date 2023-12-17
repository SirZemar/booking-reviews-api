import { getFirestore } from "firebase-admin/firestore";
import { reviewsDataService } from "../reviews";

const collection = "apartments";

export const addNewApartment = async (id: string) => {
	const db = getFirestore();

	await db.collection(collection).doc(id).set({ id });
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
