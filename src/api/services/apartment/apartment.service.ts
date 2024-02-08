import { puppeteerApartmentService } from "../puppeteer";

/**
 * Check if there is a booking page with the apartment id provided
 * @param id 
 * @returns Promise with a boololean
 */
export const isBookingApartmentValid = async (id: string): Promise<boolean> => {
	try {
		if (id.length < 3) {
			return false;
		}
		const page = await puppeteerApartmentService.createApartmentPage();
		const response = await puppeteerApartmentService.gotoApartmentPage(
			page,
			id
		);
		if (response) {
			return response.ok() ? true : false;
		} else {
			return false;
		}
	} catch (error) {
		throw new Error(`Failed to verify booking apartment. ${error}`);
	}
};
