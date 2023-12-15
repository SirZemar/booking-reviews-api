import { Request, Response, NextFunction } from "express";
import { reviewsDataService } from "../services/firestore/reviews";
import { Review } from "../models";

export const getRevieRatesController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const pageName = req.params.pageName;

		const apartmentDoc = await reviewsDataService.getApartment(pageName);
		if (!apartmentDoc.exists) {
			return res.json({ msg: `Failed to find ${pageName}` });
		}
		const reviewRatesQuery = await reviewsDataService.getReviewRatesOfApartment(
			pageName
		);

		if (reviewRatesQuery.empty) {
			return res.json({ msg: `${pageName} has no review rates.` });
		}

		const reviewRates: number[] = [];
		reviewRatesQuery.forEach((review) => {
			const data = review.data() as Review;

			reviewRates.push(data.rate);
		});
		return res.send({ reviewRates });
	} catch (error) {
		return next(error);
	}
};
