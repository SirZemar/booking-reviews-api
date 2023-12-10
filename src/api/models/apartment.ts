import { Review } from "./review"

export type Apartment = {
  reviews: Review[],
  reviewRateAverage: number,
}