export const removeNegativeValue = (rates: number[]): number[] => {
	return rates.filter((n: number) => n > 0);
};
export const calculateAverage = (numbers: number[]): number => {
	const totalSum = numbers.reduce((prev, n) => prev + n);
	return totalSum / numbers.length;
};
