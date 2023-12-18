import puppeteer, { HTTPRequest, Page } from "puppeteer";
import { ReviewRaw } from "../../models/review.model";

// Puppeteer service that creates page of booking reviews list
export const createReviewsListPage = async (): Promise<Page> => {
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

export const goToReviewsListPage = async (
	page: Page,
	apartmentId: string,
	offset?: number
): Promise<string> => {
	let url: string;
	url = `https://www.booking.com/reviewlist.pt-pt.html?pagename=${apartmentId}&;cc1=pt&rows=10&sort=f_recent_desc`;

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
		const totalReviewsPages: number = await page.$eval(
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
		return totalReviewsPages;
	} catch (error) {
		throw new Error(`Failed to get booking total review pages: ${error}`);
	}
};

export const scrapeReviewsFromPage = async (
	page: Page
): Promise<ReviewRaw[]> => {
	try {
		const scrapedReviews = await page.$$eval(
			".review_list_new_item_block",
			(els) =>
				els.map((reviewElement) => {
					let reviewRating = 0;
					let reviewDate = "";
					let reviewId = "";
					let scrapeError = false;

					const reviewRatingSelector = ".bui-review-score__badge";
					const reviewDateSelector =
						".c-review-block__right .c-review-block__date";
					const reviewUrlAttribute = "data-review-url";

					// Get rate
					const reviewRatingElement =
						reviewElement.querySelector(reviewRatingSelector);

					const scrapedReviewRating = reviewRatingElement?.textContent;
					if (scrapedReviewRating) {
						reviewRating = parseInt(scrapedReviewRating);
					} else {
						console.warn(
							`Failed to scrape review rate from element in page ${page} with selector "${reviewRatingSelector}"`
						);
						scrapeError = true;
					}

					// Get date
					const reviewDateElement =
						reviewElement.querySelector(reviewDateSelector);
					const scrapedReviewDate = reviewDateElement?.textContent;
					if (scrapedReviewDate) {
						reviewDate = scrapedReviewDate;
					} else {
						console.warn(
							`Failed to scrape review date from element in page ${page} with selector "${reviewDateSelector}"`
						);
						scrapeError = true;
					}

					// Get id
					const scrapedReviewUrl =
						reviewElement.getAttribute(reviewUrlAttribute);
					if (scrapedReviewUrl) {
						reviewId = scrapedReviewUrl;
					} else {
						console.warn(
							`Failed to scrape review url from element in page ${page} with attribute "${reviewUrlAttribute}"`
						);
						scrapeError = true;
					}
					if (!scrapeError) {
						return { rate: reviewRating, date: reviewDate, id: reviewId };
					} else {
						return { rate: -1, date: "remove", id: "remove" };
					}
				})
		);
		const reviewsRaw = scrapedReviews.filter((review) => review.rate >= 0);
		return reviewsRaw;
	} catch (error) {
		throw new Error(`Failed to scrape reviews from page ${page}: ${error}`);
	}
};
