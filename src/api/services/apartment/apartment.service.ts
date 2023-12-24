import { puppeteerApartmentService } from "../puppeteer";

export const verifyBookingApartment = async (id: string) => {
	try {
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
