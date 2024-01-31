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

		const isApartmentValid = await apartmentService.isBookingApartmentValid(
			apartmentId
		);
		if (!isApartmentValid) {
			return res
				.status(500)
				.json({ msg: `${apartmentId} is not a valid apartment` });
		}
		const scrapedReviews = await reviewsService.scrapeNewReviews(apartmentId);

		// Handlers when new scrape of reviews is done
		await reviewsService.handleScrapeReviews(apartmentId);

		if (scrapedReviews.length === 0) {
			return res.json({ msg: `There are no new reviews` });
		}

		// Handle if new reviews are found
		const batch = await reviewsDataService.addReviewsBatchToApartment(
			scrapedReviews,
			apartmentId
		);

		// Handlers when new batch of reviews is created
		await reviewsService.handleBatchReviewsCreate(apartmentId);

		return res.json({ msg: `Successfully added ${batch.length} new reviews` });
	} catch (error) {
		return next(error);
	}
};
