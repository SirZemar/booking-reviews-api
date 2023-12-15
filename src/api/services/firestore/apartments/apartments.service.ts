import { getFirestore } from "firebase-admin/firestore";
import { reviewsDataService } from "../reviews";

const collection = "apartments";

export const updateReviewsCount = async (id: string) => {
	const db = getFirestore();

	const reviewsCountQuery = await reviewsDataService.reviewsCount(id);

	const reviewsCount = reviewsCountQuery.data().count;

	await db.collection(collection).doc(id).update({ reviewsCount });
};

export const updateReviewsAverage = async (
	id: string,
	reviewsAverage: number
) => {
	const db = getFirestore();

	// await db.collection(collection).doc(id).update({ reviewsAverage });
	await db.collection(collection).doc(id).update({ reviewsAverage });
};
