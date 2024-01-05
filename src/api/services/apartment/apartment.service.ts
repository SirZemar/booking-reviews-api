import { puppeteerApartmentService } from "../puppeteer";

export const isBookingApartmentValid = async (id: string) => {
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
