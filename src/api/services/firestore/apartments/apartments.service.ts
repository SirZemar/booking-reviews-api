import {
	DocumentSnapshot,
	QuerySnapshot,
	Timestamp,
	getFirestore,
} from "firebase-admin/firestore";
import { reviewsDataService } from "../reviews";
import {
	AddApartment,
	EditApartment,
	StatusEnum,
} from "../../../models/apartment.model";
import { firestore } from "firebase-admin";

const collection = "apartments";
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

export const addNewApartment = async (
	apartmentData: AddApartment
): Promise<void> => {
	const db = getFirestore();
	await db
		.collection(collection)
		.doc(apartmentData.id)
		.set({ ...apartmentData, status: StatusEnum.PENDING });
};

export const patchApartment = async (apartmentData: EditApartment): Promise<void> => {
	const db = getFirestore();
	await db
		.collection(collection)
		.doc(apartmentData.id)
		.set(apartmentData, { merge: true });
};

export const deleteApartment = async (id: string): Promise<void> => {
	const db = getFirestore();
	const docRef = db.collection(collection).doc(id);
	await db.recursiveDelete(docRef);
};

export const setLastReviewsScrape = async (id: string): Promise<void> => {
	const db = getFirestore();
	const lastReviewsScrape = Timestamp.now();

	await db
		.collection(collection)
		.doc(id)
		.set({ lastReviewsScrape }, { merge: true });
};

export const setReviewsCount = async (id: string): Promise<void> => {
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
): Promise<void> => {
	const db = getFirestore();

	// await db.collection(collection).doc(id).update({ reviewsAverage });
	await db
		.collection(collection)
		.doc(id)
		.set({ reviewsRatingAverage }, { merge: true });
};

//TODO Remove
export const changeStatusDB = async () => {
	const db = getFirestore();

	const a = await db.collection(collection).get();

	a.forEach((doc) =>
		doc.ref.update({
			status: "ready",
			reviewsStatus: "ready",
		})
	);
};