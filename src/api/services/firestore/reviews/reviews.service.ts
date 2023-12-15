import { DocumentSnapshot, QuerySnapshot } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";
import { Review } from "../../../models";
import { firestore } from "firebase-admin";

const collection = "apartments";
const subCollection = "reviews";

export const getAllApartments = async (): Promise<QuerySnapshot> => {
	const db = firestore();
	const querySnapshot = await db.collection(collection).get();
	return querySnapshot;
};

export const getApartment = async (id: string): Promise<DocumentSnapshot> => {
	const db = firestore();
	const docSnapshot = await db.collection(collection).doc(id).get();
	return docSnapshot;
};

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
export const getReviewRatesOfApartment = async (
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

export const reviewsCount = async (id: string) => {
	const db = getFirestore();

	const aggregateQuery = await db
		.collection(collection)
		.doc(id)
		.collection("reviews")
		.count()
		.get();

	return aggregateQuery;
};
