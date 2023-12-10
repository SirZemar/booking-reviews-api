import QueryString = require("qs");

// TODO Refactor models

export type Query =
	| string
	| QueryString.ParsedQs
	| string[]
	| QueryString.ParsedQs[]
	| undefined;

export type Analytics = {
	average: number;
	totalSum: number;
	numberOfReviews: number;
	targetRate: number;
	targetRateBeforeBookingRound: number;
	numberOfTopRateReviewsNeeded: number;
};

export type Review = {
	date: any;
	rate: number;
	id: string;
};

export * as Dates from "./dates";
