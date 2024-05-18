import { Timestamp } from "firebase-admin/firestore";
import { Review } from "./review.model";

export enum StatusEnum {
	PENDING = "pending",
	READY = "ready",
	UPDATING = "updating",
}
export type Apartment = {
	id: string;
	reviewsRatingAverage: number;
	reviewsCount: number;
	lastReviewsScrape: Timestamp;
	reviews: Review[];
	name: string;
	reviewStatus: StatusEnum.PENDING | StatusEnum.READY | StatusEnum.UPDATING;
};

export interface ActionResponse {
	msg: string;
	apartment: Apartment;
}
export type AddApartment = Pick<Apartment, "id" | "name">;
export type EditApartment = Pick<Apartment, "id"> & Partial<Apartment>;
export type DeleteApartment = Pick<Apartment, "id">;