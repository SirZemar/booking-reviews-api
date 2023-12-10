import { Request, Response } from "express";
import { getScrapedReviewsData } from "../services/reviewRates";
import { reviewDataService } from "../data/reviews";
import { WriteResult } from "firebase-admin/firestore";
import puppeteer from "puppeteer";

export const scrapeReviewsController = async (req: Request, res: Response) => {
	try {
		const pageName = req.params.pageName;

		// Launch puppeteer browser
		const browser = await puppeteer.launch({
			headless: "new",
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});

		// Scrape new reviews data and add to db
		const scrapedReviews = await getScrapedReviewsData(pageName, browser);
		let batch: WriteResult[] = [];
		if (scrapedReviews.length > 0) {
			batch = await reviewDataService.addReviewsBatchToApartment(
				scrapedReviews,
				pageName
			);
		}
		res.json({ msg: `Successfully added ${batch.length} new reviews` });
	} catch (error) {
		throw new Error(`Failed to scrape reviews ${error}`);
	}
};
