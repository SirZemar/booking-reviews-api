import { Request, Response, NextFunction } from "express";
import { apartmentDataService } from "../services/firestore/apartments";

export const patchApartment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const apartmentId = req.params.apartmentId;
		const payload = req.body;

		await apartmentDataService.patchApartment(apartmentId, payload);
		return res.json({ msg: `Successfully edited apartment ${apartmentId}` });
	} catch (error) {
		return next(error);
	}
};
