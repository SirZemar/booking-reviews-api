import { puppeteerApartmentService } from "../puppeteer";

export const verifyBookingApartment = async (id: string) => {
	try {
		const page = await puppeteerApartmentService.createApartmentPage();
		await puppeteerApartmentService.gotoApartmentPage(page, id);
	} catch (error) {
		throw new Error(`Failed to verify booking apartment. ${error}`);
	}
};
