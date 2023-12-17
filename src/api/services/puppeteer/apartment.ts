import puppeteer, { HTTPRequest, Page } from "puppeteer";

export const createApartmentPage = async (): Promise<Page> => {
	try {
		// Launch puppeteer
		const browser = await puppeteer.launch({
			headless: "new",
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});

		const page: Page = await browser.newPage();
		await page.setUserAgent(
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3738.0 Safari/537.36"
		);

		// Allow request only of reviewlist
		await page.setRequestInterception(true);
		page.on("request", (request: HTTPRequest) => {
			if (!(request.resourceType() === "document")) {
				request.abort();
			} else {
				console.log(request.url());
				request.continue();
			}
		});

		return page;
	} catch (error) {
		throw new Error(`Failed to set puppeteer page. ${error}`);
	}
};

export const gotoApartmentPage = async (
	page: Page,
	apartmentId: string
): Promise<string> => {
	let url: string;
	url = `https://www.booking.com/hotel/pt/${apartmentId}.pt-pt.html`;

	const response = await page.goto(url);
	if (!response?.ok()) {
		throw new Error(`Booking apartment not found with url ${url}`);
	}
	return url;
};
