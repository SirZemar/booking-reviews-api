import { Request, Response, NextFunction } from "express";
import { apartmentDataService } from "../services/firestore/apartments";
import { Apartment } from "../models";

export const patchApartment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const apartmentId = req.params.apartmentId;
		const payload = req.body as Partial<Apartment>;

		await apartmentDataService.patchApartment(apartmentId, payload);
		return res.json({ msg: `Successfully edited apartment ${apartmentId}` });
	} catch (error) {
		return next(error);
	}
};
