import { Browser, HTTPRequest, Page } from "puppeteer";

// Puppeteer service that creates page of booking reviews list
export const createReviewListPage = async (browser: Browser): Promise<Page> => {
	try {
		const page: Page = await browser.newPage();
		await page.setUserAgent(
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3738.0 Safari/537.36"
		);
		// Allow request only of reviewlist
		await page.setRequestInterception(true);
		page.on("request", (request: HTTPRequest) => {
			if (!request.url().includes("reviewlist")) {
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

export const goToReviewListPage = async (
	page: Page,
	pageName: string,
	offset?: number
): Promise<string> => {
	let url: string;
	url = `https://www.booking.com/reviewlist.pt-pt.html?pagename=${pageName}&;cc1=pt&rows=10&sort=f_recent_desc`;

	if (offset) {
		url = url + `&offset=${offset}`;
	}

	const response = await page.goto(url);
	if (!response?.ok()) {
		throw new Error(`Booking review list not found with url ${url}`);
	}
	return url;
};

// Puppeteer get total of booking reviews service
export const scrapeNumberOfTotalReviewsPages = async (
	page: Page
): Promise<number> => {
	try {
		const totalReviews: number = await page.$eval(
			".bui-pagination__pages > .bui-pagination__list > .bui-pagination__item:last-child > a",
			(el) => {
				const pageNumberString = el.getAttribute("data-page-number");
				if (pageNumberString) {
					return parseInt(pageNumberString);
				} else {
					throw new Error(
						"Failed to get page number from element attribute 'data-page-number'"
					);
				}
			}
		);
		return totalReviews;
	} catch (error) {
		throw new Error(`Failed to get booking total reviews: ${error}`);
	}
};

// TODO Replace scrapeReviewRatesFromPage and scrapeReviewDatesFromPage
// TODO Return Review type
export const scrapeReviewsFromPage = async (page: Page): Promise<any[]> => {
	try {
		const reviews = await page.$$eval(".review_list_new_item_block", (els) =>
			els.map((reviewElement) => {
				let rate: number;
				let date: any;
				let scrapeError = false;

				// Get rate
				const rateElement = reviewElement.querySelector(
					".bui-review-score__badge"
				);

				const scrapedRate = rateElement?.textContent;
				if (scrapedRate) {
					rate = parseInt(scrapedRate);
					date = "";
				} else {
					console.warn("Failed to get rate from event");
					scrapeError = true;
					rate = -1;
				}

				// Get date
				const dateElement = reviewElement.querySelector(
					".c-review-block__right .c-review-block__date"
				);
				const scrapedDate = dateElement?.textContent;
				if (scrapedDate) {
					date = scrapedDate;
				} else {
					console.warn("Failed to get date from event");
					scrapeError = true;
					date = "";
				}

				// Get id
				const id = reviewElement.getAttribute("data-review-url");

				if (!scrapeError) {
					return { rate, date, id };
				}
				return ""; // TODO remove
			})
		);
		return reviews;
	} catch (error) {
		throw new Error(`Failed to get reviews: ${error}`);
	}
};

// Puppeteer get booking reviews service
export const scrapeReviewRatesFromPage = async (
	page: Page
): Promise<number[]> => {
	let rates: number[];
	try {
		rates = await page.$$eval(".bui-review-score__badge", (els) =>
			els.map((el) => {
				const rateString = el.textContent;
				if (rateString) {
					return parseInt(rateString);
				} else {
					console.warn("Failed to get rate from event");
					// Is added a negative value to rates so after can be removed
					return -1;
				}
			})
		);
		return rates;
	} catch (error) {
		throw new Error(`Failed to get reviews rates: ${error}`);
	}
};

export const scrapeReviewDatesFromPage = async (
	page: Page
): Promise<string[]> => {
	let reviewDates: string[];
	try {
		reviewDates = await page.$$eval(
			".review_list_new_item_block .c-review-block__right .c-review-block__date",
			(dateEls) => {
				return dateEls.map((el) => {
					const scrapedDate = el.textContent;
					if (scrapedDate) {
						return scrapedDate;
					} else {
						return "";
					}
				});
			}
		);
		return reviewDates;
	} catch (error) {
		throw new Error(`Failed to get review dates: ${error}`);
	}
};
