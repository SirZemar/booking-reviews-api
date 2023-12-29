import { NextFunction, Request, Response } from "express";
import { reviewsDataService } from "../services/firestore/reviews";
import { reviewsService } from "../services/reviews";
import { apartmentService } from "../services/apartment";

export const scrapeReviews = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const apartmentId = req.params.apartmentId;

		const isApartmentValid = await apartmentService.verifyBookingApartment(
			apartmentId
		);
		if (!isApartmentValid) {
			res.status(500).json({ msg: `${apartmentId} is not a valid apartment` });
		}
		const scrapedReviews = await reviewsService.scrapeNewReviews(apartmentId);

		if (scrapedReviews.length === 0) {
			res.json({ msg: `There are no new reviews` });
		}

		// Handlers when new scrape of reviews is done
		await reviewsService.handleScrapeReviews(apartmentId);

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
