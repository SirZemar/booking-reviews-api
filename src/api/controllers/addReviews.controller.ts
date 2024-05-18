import { Request, Response, NextFunction } from "express";
import { reviewsService } from "../services/reviews";
import { reviewsDataService } from "../services/firestore/reviews";
import { Review } from "../models";
import { Timestamp } from "firebase-admin/firestore";
import { ReviewTimestampPrefix as ReviewBody } from "../models/review.model";

export const addReviews = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const apartmentId = req.params.apartmentId;
		const reviewBody = req.body as ReviewBody[];
		let batch: FirebaseFirestore.WriteResult[] = [];

		if (reviewBody.length > 0) {
			const reviews = reviewBody.map((review: ReviewBody): Review => {
				const timestamp: Timestamp = new Timestamp(
					review.date._seconds,
					review.date._nanoseconds
				);
				return { ...review, date: timestamp } as Review;
			});
			batch = await reviewsDataService.addReviewsBatchToApartment(
				reviews,
				apartmentId
			);
		}
		// Handlers when new batch of reviews is created
		await reviewsService.handleBatchReviewsCreate(apartmentId);

		if (batch.length > 0) {
			return res.json({
				msg: `Successfully added ${batch.length} new reviews`,
				id: apartmentId,
			});
		} else {
			return res.json({ msg: `No reviews added`, id: apartmentId });
		}
	} catch (error) {
		return next(error);
	}
};
