import { QuerySnapshot } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";
import { Review } from "../../../models";

const collection = "apartments";
const subCollection = "reviews";

export const getMostRecentReviewOfApartment = async (
	id: string
): Promise<QuerySnapshot> => {
	const db = getFirestore();
	const querySnapshot = await db
		.collection(collection)
		.doc(id)
		.collection(subCollection)
		.orderBy("date", "desc")
		.orderBy("id", "asc")
		.limit(1)
		.get();
	return querySnapshot;
};
export const getReviewRatingsOfApartment = async (
	id: string
): Promise<QuerySnapshot> => {
	const db = getFirestore();
	const querySnapshot = await db
		.collection(collection)
		.doc(id)
		.collection(subCollection)
		.select("rate")
		.get();
	return querySnapshot;
};

export const addReviewsBatchToApartment = async (
	reviews: Review[],
	id: string
) => {
	const db = getFirestore();
	const batch = db.batch();

	reviews.forEach((review) => {
		const docRef = db
			.collection(collection)
			.doc(id)
			.collection(subCollection)
			.doc();
		batch.set(docRef, review);
	});
	return await batch.commit();
};

export const deleteReviewsBatchUpToDate = async (
	id: string,
	date: FirebaseFirestore.Timestamp
) => {
	const db = getFirestore();
	const batch = db.batch();

	const querySnapshot = await db
		.collection(collection)
		.doc(id)
		.collection(subCollection)
		.where("date", "<", date)
		.get();

	querySnapshot.forEach((doc) => {
		batch.delete(doc.ref);
	});

	await batch.commit();
};

export const test = async (id: string, date: FirebaseFirestore.Timestamp) => {
	const db = getFirestore();

	const querySnapshot = await db
		.collection(collection)
		.doc(id)
		.collection(subCollection)
		.where("date", "<", date)
		.get();

	return querySnapshot;
};
export const reviewsCount = async (id: string) => {
	const db = getFirestore();

	const aggregateQuery = await db
		.collection(collection)
		.doc(id)
		.collection(subCollection)
		.count()
		.get();

	return aggregateQuery;
};
