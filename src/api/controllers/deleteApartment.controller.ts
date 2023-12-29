import { Request, Response, NextFunction } from "express";
import { apartmentDataService } from "../services/firestore/apartments";

export const deleteApartment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const apartmentId = req.params.apartmentId;

		await apartmentDataService.deleteApartment(apartmentId);
		res.json({ msg: `Successfully deleted apartment ${apartmentId}` });
	} catch (error) {
		return next(error);
	}
};
