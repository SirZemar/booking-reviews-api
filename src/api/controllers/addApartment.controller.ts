import { Request, Response, NextFunction } from "express";
import { apartmentDataService } from "../services/firestore/apartments";
import { apartmentService } from "../services/apartment";

export const addApartment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const apartmentId = req.params.apartmentId;

		// Verify if booking apartment exist
		await apartmentService.verifyBookingApartment(apartmentId);

		await apartmentDataService.addNewApartment(apartmentId);
		res.json({ msg: `Successfully added apartment ${apartmentId}` });
	} catch (error) {
		next(error);
	}
};
