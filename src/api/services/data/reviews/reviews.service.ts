import { DocumentSnapshot, QuerySnapshot } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";
import { Review } from "../../../models";
import { firestore } from "firebase-admin";

const collection = "apartments";
const subCollection = "reviews";

export const getAllApartments = async (): Promise<QuerySnapshot> => {
	const db = firestore();
	const query = await db.collection(collection).get();
	return query;
};

export const getApartment = async (id: string): Promise<DocumentSnapshot> => {
	const db = firestore();
	const query = await db.collection(collection).doc(id).get();
	return query;
};

export const getMostRecentReviewOfApartment = async (
	id: string
): Promise<QuerySnapshot> => {
	const db = getFirestore();
	const query = await db
		.collection(collection)
		.doc(id)
		.collection(subCollection)
		.orderBy("date", "desc")
		.orderBy("id", "asc")
		.limit(1)
		.get();
	return query;
};
export const getReviewRatesOfApartment = async (
	id: string
): Promise<QuerySnapshot> => {
	const db = getFirestore();
	const query = await db
		.collection(collection)
		.doc(id)
		.collection(subCollection)
		.select("rate")
		.get();
	return query;
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
