import { Request, Response, NextFunction } from "express";
import { reviewsDataService } from "../services/firestore/reviews";
import { Apartment } from "../models/apartment.model";

export const getApartment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const apartmentId = req.params.apartmentId;

		const apartmentDoc = await reviewsDataService.getApartment(apartmentId);

		if (!apartmentDoc.exists) {
			return res.status(500).json({ msg: `Failed to find ${apartmentId}` });
		} else {
			const apartment: Apartment = apartmentDoc.data() as Apartment;

			return res.send(apartment);
		}
	} catch (error) {
		return next(error);
	}
};
