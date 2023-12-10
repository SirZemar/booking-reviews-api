import { Request, Response } from "express";
import { reviewDataService } from "../data/reviews";
import { Apartment } from "../models/apartment";

//TODO THIS QUERY IS WRONG! Should return a name and the review true average   
export const getApartmentsController = async (req: Request, res: Response) => {
	try {
		const apartmentsQuery = await reviewDataService.getApartments();

		if (apartmentsQuery.empty) {
			res.json({ message: "No apartments were found." });
		}
    const apartments: Apartment[] = [];

		apartmentsQuery.forEach((apartmentQuery) => {
			apartments.push(apartmentQuery.data() as Apartment);
		});

    res.send({apartments});
	} catch (error) {
    throw new Error(`Failed to get apartments. ${error}`);
  }
};
