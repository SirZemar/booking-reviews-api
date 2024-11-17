import { Request, Response, NextFunction } from "express";
import { reviewsService } from "../services/reviews";
import { getApartment } from "../services/firestore/apartments/apartments.service";

export const deleteOldReviews = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const apartmentId = req.params.apartmentId;

		const apartmentSnapshot = await getApartment(apartmentId);

		if (!apartmentSnapshot.exists) {
			throw new Error(`Failed to find apartment with id ${apartmentId}`);
		}

		reviewsService.deleteOldReviews(apartmentId);

		return res.json({
			msg: `Successfully deleted apartment ${apartmentId}`,
			id: apartmentId,
		});
	} catch (error) {
		return next(error);
	}
};
