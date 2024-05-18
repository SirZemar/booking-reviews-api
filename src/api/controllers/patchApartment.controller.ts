import { Request, Response, NextFunction } from "express";
import { apartmentDataService } from "../services/firestore/apartments";
import { EditApartment } from "../models/apartment.model";

export const patchApartment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const apartmentId = req.params.apartmentId;
		const apartmentData = req.body as EditApartment;

		await apartmentDataService.patchApartment(apartmentData);
		return res.json({
			msg: `Successfully edited apartment ${apartmentId}`,
			id: apartmentId,
		});
	} catch (error) {
		return next(error);
	}
};
