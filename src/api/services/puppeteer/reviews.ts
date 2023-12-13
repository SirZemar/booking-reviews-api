import puppeteer, { HTTPRequest, Page } from "puppeteer";
import { Review, ReviewRaw } from "../../models/review";
import { logger } from "firebase-functions/v1";
import { reviewsDataService } from "../data/reviews";
import { convertBookingReviewDateToTimestamp } from "../../utils/convertBookingReviewDate";

export const scrapeNewReviews = async (pageName: string) => {
	const reviews = [];

	// Creates new page in booking review list and navigate to it
	const page = await createReviewsListPage();
	await goToReviewsListPage(page, pageName);

	// Get value of total number reviews in the list
	const totalPages = await scrapeNumberOfTotalReviewsPages(page);

	// Get most recent review stored in db
	const mostRecentReviewQuery =
		await reviewsDataService.getMostRecentReviewOfApartment(pageName);

	// Get all review rates and push results into reviewRates array
	const maxOffset = (totalPages - 1) * 10;

	for (let offset = 0; offset <= maxOffset; offset += 10) {
		await goToReviewsListPage(page, pageName, offset);

		const scrapedReviewsRaw = await scrapeReviewsFromPage(page);

		// Reviews data is in a specific string format on booking and it needs to be converted into a timestamp
		const scrapedReviews = scrapedReviewsRaw.map(
			(review: ReviewRaw): Review => {
				const date = convertBookingReviewDateToTimestamp(review.date);
				return { ...review, date };
			}
		);

		// If there is a most recent review compare with scraped review. Else, push scraped without comparing
		if (mostRecentReviewQuery.empty) {
			reviews.push(...scrapedReviews);
		} else {
			const mostRecentReview = mostRecentReviewQuery.docs[0].data() as Review;
			const recentReviewsData = filterNewReviews(
				scrapedReviews,
				mostRecentReview
			);

			reviews.push(...recentReviewsData);

			// Loop stop when last page or when a already stored review is found
			if (recentReviewsData.length < 10) {
				break;
			}
		}
	}
	return reviews;
};

// Puppeteer service that creates page of booking reviews list
const createReviewsListPage = async (): Promise<Page> => {
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

const goToReviewsListPage = async (
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
const scrapeNumberOfTotalReviewsPages = async (page: Page): Promise<number> => {
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

const scrapeReviewsFromPage = async (page: Page): Promise<ReviewRaw[]> => {
	try {
		const scrapedReviews = await page.$$eval(
			".review_list_new_item_block",
			(els) =>
				els.map((reviewElement) => {
					let reviewRate = 0;
					let reviewDate = "";
					let reviewId = "";
					let scrapeError = false;

					const reviewRateSelector = ".bui-review-score__badge";
					const reviewDateSelector =
						".c-review-block__right .c-review-block__date";
					const reviewUrlAttribute = "data-review-url";

					// Get rate
					const reviewRateElement =
						reviewElement.querySelector(reviewRateSelector);

					const scrapedReviewRate = reviewRateElement?.textContent;
					if (scrapedReviewRate) {
						reviewRate = parseInt(scrapedReviewRate);
					} else {
						logger.warn(
							`Failed to scrape review rate from element in page ${page} with selector "${reviewRateSelector}"`
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
						logger.warn(
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
						logger.warn(
							`Failed to scrape review url from element in page ${page} with attribute "${reviewUrlAttribute}"`
						);
						scrapeError = true;
					}
					if (!scrapeError) {
						return { rate: reviewRate, date: reviewDate, id: reviewId };
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

const filterNewReviews = (
	reviews: Review[],
	mostRecentReview: Review
): Review[] => {
	const sortedReviews = reviews.sort((a, b) => {
		// Compare by date in descending order
		if (a.date.valueOf() > b.date.valueOf()) {
			return -1;
		} else if (a.date.valueOf() < b.date.valueOf()) {
			return 1;
		} else {
			// If dates are equal, compare by ID
			if (a.id < b.id) {
				return -1;
			} else if (a.id > b.id) {
				return 1;
			} else {
				return 0; // If both date and ID are equal, no change in order
			}
		}
	});

	const newReviews: Review[] = [];

	for (let i = 0; i < sortedReviews.length; i++) {
		if (sortedReviews[i].date.valueOf() > mostRecentReview.date.valueOf()) {
			newReviews.push(sortedReviews[i]);
		} else if (
			sortedReviews[i].date.valueOf() === mostRecentReview.date.valueOf()
		) {
			if (sortedReviews[i].id !== mostRecentReview.id) {
				newReviews.push(sortedReviews[i]);
			} else {
				break;
			}
		}
	}

	return newReviews;
};
