import express = require("express");
import { getApartmentsController } from "../controllers/getApartments";
import { addApartmentController } from "../controllers/addApartmentController";
import { scrapeReviewsController } from "../controllers/scrapeReviewsController";
import { getReviewRatingsController } from "../controllers/reviewRatings";

const apartmentsRouter = express.Router();

apartmentsRouter.get("/", getApartmentsController);

apartmentsRouter.post("/:apartmentId/add", addApartmentController);

apartmentsRouter.get("/:apartmentId/scrapeReviews", scrapeReviewsController);

apartmentsRouter.get(
	"/:apartmentId/getReviewRatings",
	getReviewRatingsController
);

export default apartmentsRouter;
