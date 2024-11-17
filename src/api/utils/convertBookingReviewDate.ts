import { Timestamp } from "firebase-admin/firestore";
import { Dates } from "../models";
import { monthMap } from "./static/monthMap";

const isScrapedMonthValid = (month: string): void => {
	const valid = month in monthMap;
	if (!valid) {
		throw new Error(`${month} is not a valid booking review month`);
	}
};

const isScrapedDayValid = (day: string): void => {
	const dayNumber = parseInt(day);
	const valid = dayNumber >= 1 && dayNumber <= 31;
	if (!valid) {
		throw new Error(`${day} is not a valid booking review day`);
	}
};

const isScrapedYearValid = (year: string): void => {
	let yearNumber = parseInt(year);
	let i = 1;
	while (yearNumber > 9) {
		yearNumber = Math.floor(yearNumber / 10);
		i++;
	}
	const valid = i === 4;
	if (!valid) {
		throw new Error(`${year} is not a valid booking review year`);
	}
};

export const convertBookingReviewDateToTimestamp = (
	scrapedDate: string
): FirebaseFirestore.Timestamp => {
	let timestamp: any;
	timestamp = "";
	try {
		const dateParts = scrapedDate.trim().split(/: | de |, /);

		const day = dateParts[1];
		const monthExtended: Dates.Months =
			dateParts[2].toLocaleLowerCase() as Dates.Months;
		const month = monthMap[monthExtended];
		const year = dateParts[3];

		isScrapedDayValid(day);
		isScrapedMonthValid(dateParts[2].toLocaleLowerCase());
		isScrapedYearValid(year);

		const date = `${year}-${month}-${day}`;

		timestamp = Timestamp.fromDate(new Date(date));
	} catch (error) {
		throw new Error(
			`Failed to convert booking review date to firestore timestamp: ${error}`
		);
	}
	return timestamp;
};
