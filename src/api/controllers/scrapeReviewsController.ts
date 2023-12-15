import { NextFunction, Request, Response } from "express";
import { reviewsDataService } from "../services/firestore/reviews";
import { puppeteerReviewsService } from "../services/puppeteer";
import { reviewsService } from "../services/reviews";

export const scrapeReviewsController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const apartmentId = req.params.pageName;

		const scrapedReviews = await puppeteerReviewsService.scrapeNewReviews(
			apartmentId
		);

		if (scrapedReviews.length === 0) {
			res.json({ msg: `There are no new reviews` });
		}

		const batch = await reviewsDataService.addReviewsBatchToApartment(
			scrapedReviews,
			apartmentId
		);

		// Handlers when new batch of reviews is created
		await reviewsService.handleBatchReviewsCreate(apartmentId);

		res.json({ msg: `Successfully added ${batch.length} new reviews` });
	} catch (error) {
		return next(error);
	}
};
