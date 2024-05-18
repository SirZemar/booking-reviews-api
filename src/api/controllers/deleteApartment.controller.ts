import { Request, Response, NextFunction } from "express";
import { apartmentDataService } from "../services/firestore/apartments";
import { getApartment } from "../services/firestore/apartments/apartments.service";

export const deleteApartment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const apartmentId = req.params.apartmentId;

		const apartmentSnapshot = await getApartment(apartmentId);

		if (!apartmentSnapshot.exists) {
			throw new Error(`Failed to find apartment with id ${apartmentId}`);
		}
		await apartmentDataService.deleteApartment(apartmentId);
		return res.json({
			msg: `Successfully deleted apartment ${apartmentId}`,
			id: apartmentId,
		});
	} catch (error) {
		return next(error);
	}
};
