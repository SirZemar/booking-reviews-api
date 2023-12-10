export type Months =
	| "janeiro"
	| "fevereiro"
	| "março"
	| "abril"
	| "maio"
	| "junho"
	| "julho"
	| "agosto"
	| "setembro"
	| "outubro"
	| "novembro"
	| "dezembro";

export type MonthMap = {
	[key in Months]: string;
};
