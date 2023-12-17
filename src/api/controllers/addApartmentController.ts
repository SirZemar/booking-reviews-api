import { Request, Response, NextFunction } from "express";
import { apartmentDataService } from "../services/firestore/apartments";
// import { apartmentDataService } from "../services/firestore/apartments";

export const addApartmentController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const apartmentId = req.params.apartmentId;

		await apartmentDataService.addNewApartment(apartmentId);
		res.json({ msg: `Successfully added apartment ${apartmentId}` });
	} catch (error) {
		next(error);
	}
};
