import { NextFunction, Request, Response } from "express";
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

		await reviewsService.handleScrapeReviews(apartmentId);

		if (scrapedReviews.length === 0) {
			return res.json({ msg: `There are no new reviews` });
		}
		return res.json(scrapedReviews);
	} catch (error) {
		return next(error);
	}
};
