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
		const payload = req.body;

		// Verify if booking apartment exist
		const isApartmentValid = await apartmentService.verifyBookingApartment(
			apartmentId
		);

		if (isApartmentValid) {
			await apartmentDataService.addNewApartment(apartmentId, payload);
			res.json({ msg: `Successfully added apartment ${apartmentId}` });
		} else {
			res.json({ msg: `${apartmentId} is not a valid booking apartment` });
		}
	} catch (error) {
		return next(error);
	}
};
