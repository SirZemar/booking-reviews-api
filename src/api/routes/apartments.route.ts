import express = require("express");
import { getApartments } from "../controllers/getApartments.controller";
import { addApartment } from "../controllers/addApartment.controller";
import { scrapeReviews } from "../controllers/scrapeReviews.controller";
import { getReviewRatings } from "../controllers/getReviewRatings.controller";
import bodyParser = require("body-parser");
import { patchApartment } from "../controllers/patchApartment.controller";
import { deleteApartment } from "../controllers/deleteApartment.controller";

const apartmentsRouter = express.Router();

apartmentsRouter.get("/", getApartments);

apartmentsRouter.post("/:apartmentId/add", bodyParser.json(), addApartment);

apartmentsRouter.patch(
	"/:apartmentId/patch",
	bodyParser.json(),
	patchApartment
);

apartmentsRouter.delete("/:apartmentId/delete", deleteApartment);

apartmentsRouter.get("/:apartmentId/scrapeReviews", scrapeReviews);

apartmentsRouter.get("/:apartmentId/getReviewRatings", getReviewRatings);

export default apartmentsRouter;
