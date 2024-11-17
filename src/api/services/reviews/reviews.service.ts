import { Timestamp } from "firebase-admin/firestore";
import { StatusEnum } from "../../models/apartment.model";
import { Review, ReviewRaw } from "../../models/review.model";
import { convertBookingReviewDateToTimestamp } from "../../utils/convertBookingReviewDate";
import { apartmentDataService } from "../firestore/apartments";
import { reviewsDataService } from "../firestore/reviews";
import { puppeteerReviewsService } from "../puppeteer";

export const scrapeNewReviews = async (apartmentId: string) => {
	try {
		const reviews = [];

		// set up a puppeteer browser
		const browser = await puppeteerReviewsService.launchPuppeteer();
		// Creates new page in booking review list and navigate to it
		const page = await puppeteerReviewsService.createReviewsListPage(browser);
		await puppeteerReviewsService.goToReviewsListPage(page, apartmentId);

		// Get value of total number reviews in the list
		const totalPages =
			await puppeteerReviewsService.scrapeNumberOfTotalReviewsPages(page);

		// Get most recent review stored in db
		const mostRecentReviewQuery =
			await reviewsDataService.getMostRecentReviewOfApartment(apartmentId);

		// Get all review rates and push results into reviewRatings array
		const maxOffset = (totalPages - 1) * 10;

		for (let offset = 0; offset <= maxOffset; offset += 10) {
			await puppeteerReviewsService.goToReviewsListPage(
				page,
				apartmentId,
				offset
			);

			const scrapedReviewsRaw =
				await puppeteerReviewsService.scrapeReviewsFromPage(page);

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
		browser.close();
		return reviews;
	} catch (error) {
		throw new Error(`Failed to scrape new reviews. ${error}`);
	}
};

export const handleBatchReviewsCreate = async (id: string) => {
	try {
		// Update apartment reviewsCount
		await apartmentDataService.setReviewsCount(id);

		// Update apartment reviewsAverage
		const reviewsQuery = await reviewsDataService.getReviewRatingsOfApartment(
			id
		);
		const reviewRatings: number[] = reviewsQuery.docs.map(
			(doc) => doc.data().rate
		);
		const totalSum = reviewRatings.reduce((prev, n) => prev + n);
		const reviewsAverage = totalSum / reviewRatings.length;
		await apartmentDataService.setReviewsRatingAverage(id, reviewsAverage);
	} catch (error) {
		throw new Error(
			`Failed when handling new batch of created reviews. ${error}`
		);
	}
};

export const handleScrapeReviews = async (id: string) => {
	try {
		await apartmentDataService.setLastReviewsScrape(id);
		await apartmentDataService.patchApartment({
			id,
			reviewStatus: StatusEnum.READY,
		});
	} catch (error) {
		throw new Error(`Failed when handling last scrape reviews. ${error}`);
	}
};

export const filterNewReviews = (
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

export const deleteOldReviews = async (id: string) => {
	try {
		// Get today's date
		const today = new Date();

		// Subtract 3 years and set time to the beginning of the day
		const threeYearsAgo = new Date(
			today.getFullYear() - 3,
			today.getMonth(),
			today.getDate()
		);
		threeYearsAgo.setHours(0, 0, 0, 0); // Ensure the time is 00:00:00

		const date = Timestamp.fromDate(threeYearsAgo);
		await reviewsDataService.deleteReviewsBatchUpToDate(id, date);
	} catch (error) {
		throw new Error(`Failed to delete old reviews`);
	}
};
