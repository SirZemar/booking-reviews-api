import { Request, Response, NextFunction } from "express";
import { reviewDataService } from "../data/reviews";
import { Review } from "../models";

export const getRevieRatesController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const pageName = req.params.pageName;

		const reviewRatesQuery = await reviewDataService.getReviewRatesOfApartment(
			pageName
		);

		// TODO Differentiate when no appartment is found and when appartment found has no new reviews
		if (reviewRatesQuery.empty) {
			// TODO Response should be in json 
			return res.send(`${pageName} has no review rates.`);
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
