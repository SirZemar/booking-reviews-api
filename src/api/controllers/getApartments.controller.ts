import { Request, Response, NextFunction } from "express";
import { reviewsDataService } from "../services/firestore/reviews";
import { Apartment } from "../models/apartment.model";

export const getApartments = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const apartmentsQuery = await reviewsDataService.getAllApartments();

		if (apartmentsQuery.empty) {
			return res.json({ msg: "No apartments were found." });
		} else {
			const apartments: Apartment[] = apartmentsQuery.docs.map(
				(apartment) => apartment.data() as Apartment
			);

			return res.send(apartments);
		}
	} catch (error) {
		return next(error);
	}
};
