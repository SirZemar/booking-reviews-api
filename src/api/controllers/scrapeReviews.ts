import { NextFunction, Request, Response } from "express";
import { reviewsDataService } from "../services/data/reviews";
import { WriteResult } from "firebase-admin/firestore";
import { puppeteerReviewsService } from "../services/puppeteer";

export const scrapeReviewsController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const pageName = req.params.pageName;

		// Scrape new reviews data and add to db
		const scrapedReviews = await puppeteerReviewsService.scrapeNewReviews(
			pageName
		);
		let batch: WriteResult[] = [];
		if (scrapedReviews.length > 0) {
			batch = await reviewsDataService.addReviewsBatchToApartment(
				scrapedReviews,
				pageName
			);
		}
		if (batch.length === 0) {
			res.json({ msg: `There are no new reviews` });
		} else {
			res.json({ msg: `Successfully added ${batch.length} new reviews` });
		}
	} catch (error) {
		return next(error);
	}
};
