import { Timestamp } from "firebase-admin/firestore";
import { Review } from "./review.model";

export enum StatusEnum {
	pending = "pending",
	ready = "ready",
}
export type Apartment = {
	id: string;
	reviewsRatingAverage: number;
	reviewsCount: number;
	lastReviewsScrape: Timestamp;
	reviews: Review[];
	name: string;
	status: StatusEnum.pending | StatusEnum.ready;
};