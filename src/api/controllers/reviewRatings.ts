import { Request, Response, NextFunction } from "express";
import { reviewsDataService } from "../services/firestore/reviews";
import { Review } from "../models";

export const getReviewRatingsController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const apartmentId = req.params.apartmentId;

		const apartmentDoc = await reviewsDataService.getApartment(apartmentId);
		if (!apartmentDoc.exists) {
			return res.json({ msg: `Failed to find ${apartmentId}` });
		}
		const reviewRatingsQuery =
			await reviewsDataService.getReviewRatingsOfApartment(apartmentId);

		if (reviewRatingsQuery.empty) {
			return res.json({ msg: `${apartmentId} has no review rates.` });
		}

		const reviewRatings: number[] = [];
		reviewRatingsQuery.forEach((review) => {
			const data = review.data() as Review;

			reviewRatings.push(data.rate);
		});
		return res.send({ reviewRatings });
	} catch (error) {
		return next(error);
	}
};
