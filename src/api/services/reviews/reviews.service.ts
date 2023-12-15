import { apartmentDataService } from "../firestore/apartments";
import { reviewsDataService } from "../firestore/reviews";

export const handleBatchReviewsCreate = async (id: string) => {
	try {
		// Update apartment reviewsCount
		await apartmentDataService.updateReviewsCount(id);

		// Update apartment reviewsAverage
		const reviewsQuery = await reviewsDataService.getReviewRatesOfApartment(id);
		const reviewRates: number[] = reviewsQuery.docs.map(
			(doc) => doc.data().rate
		);
		const totalSum = reviewRates.reduce((prev, n) => prev + n);
		const reviewsAverage = totalSum / reviewRates.length;
		await apartmentDataService.updateReviewsAverage(id, reviewsAverage);
	} catch (error) {
		throw new Error(
			`Failed when handling new batch of created reviews. ${error}`
		);
	}
};
