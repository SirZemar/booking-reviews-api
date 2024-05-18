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
		const apartmentData = req.body;

		// Verify if booking apartment exist
		const isApartmentValid = await apartmentService.isBookingApartmentValid(
			apartmentId
		);

		if (isApartmentValid) {
			await apartmentDataService.addNewApartment(apartmentData);
			return res.json({
				msg: `Successfully added apartment ${apartmentId}`,
				id: apartmentId,
			});
		} else {
			return res
				.status(500)
				.json({ msg: `${apartmentId} is not a valid booking apartment` });
		}
	} catch (error) {
		return next(error);
	}
};
