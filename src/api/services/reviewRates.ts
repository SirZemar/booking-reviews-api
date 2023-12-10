import { Analytics, Query, Review } from "../models";
import { puppeteerReviewsService } from "../services";
import { convertBookingReviewDateToTimestamp } from "../utils/convertBookingReviewDate";
import { reviewDataService } from "../data/reviews";

export const getScrapedReviewsData = async (pageName: string, browser: any) => {
	const reviews = [];

	// Creates new page in booking review list and navigate to it
	const page = await puppeteerReviewsService.createReviewListPage(browser);
	await puppeteerReviewsService.goToReviewListPage(page, pageName);

	// Get value of total number reviews in the list
	const totalPages =
		await puppeteerReviewsService.scrapeNumberOfTotalReviewsPages(page);

	// Get most recent review stored in db
	const mostRecentReviewQuery =
		await reviewDataService.getMostRecentReviewOfApartment(pageName);

	// Get all review rates and push results into reviewRates array
	const maxOffset = (totalPages - 1) * 10;

	for (let offset = 0; offset <= maxOffset; offset += 10) {
		await puppeteerReviewsService.goToReviewListPage(page, pageName, offset);

		const scrapedReviews = await puppeteerReviewsService.scrapeReviewsFromPage(
			page
		);

		const scrapedReviewsData = scrapedReviews.map((review: Review) => {
			const date = convertBookingReviewDateToTimestamp(review.date);
			return { ...review, date };
		});

		// If there is a most recent review compare with scraped review. Else, push scraped without comparing
		if (mostRecentReviewQuery.empty) {
			reviews.push(...scrapedReviewsData);
		} else {
			const mostRecentReview = mostRecentReviewQuery.docs[0].data() as Review;
			const recentReviewsData = filterNewReviews(
				scrapedReviewsData,
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

// Parse target rate query parameter into number, validade if it is a valid score and return it
export const parseTargetRateQueryToNumber = (
	targetRateQuery: Query
): number => {
	let targetRate: number;
	if (typeof targetRateQuery === "string") {
		targetRate = parseFloat(targetRateQuery);
		if (!(targetRate >= 1 && targetRate <= 10)) {
			throw new Error(
				"Target rate is not a valid score. Has to be a number between 1 and 10"
			);
		}
	} else {
		throw new Error("Query target rate is not a string");
	}
	return targetRate;
};

// Business logic that returns the analytics of collected reviews and target rate average simulation
export const getReviewsAnalytics = (
	rates: number[],
	targetRate: number
): Analytics => {
	const targetRateBeforeBookingRound = parseFloat(
		(targetRate - 0.05).toFixed(2)
	);
	const numberOfReviews = rates.length;
	const totalSum = rates.reduce((prev, n) => prev + n);
	const average = totalSum / numberOfReviews;
	const numberOfTopRateReviewsNeeded = Math.ceil(
		(targetRateBeforeBookingRound * numberOfReviews - totalSum) /
			(10 - targetRateBeforeBookingRound)
	);

	return {
		average,
		totalSum,
		numberOfReviews,
		targetRate,
		targetRateBeforeBookingRound,
		numberOfTopRateReviewsNeeded,
	};
};

// TODO Fix: If 2 or more most recent reviews have same date will create a repeat review every timed is called
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
