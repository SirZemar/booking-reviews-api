import express = require("express");
import { getApartments } from "../controllers/getApartments.controller";
import { addApartment } from "../controllers/addApartment.controller";
import { scrapeReviews } from "../controllers/scrapeReviews.controller";
import { getReviewRatings } from "../controllers/getReviewRatings.controller";

const apartmentsRouter = express.Router();

apartmentsRouter.get("/", getApartments);

apartmentsRouter.post("/:apartmentId/add", addApartment);

apartmentsRouter.get("/:apartmentId/scrapeReviews", scrapeReviews);

apartmentsRouter.get("/:apartmentId/getReviewRatings", getReviewRatings);

//TODO Delete apartment

export default apartmentsRouter;
