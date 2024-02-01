import express = require("express");
import { getAllApartments } from "../controllers/getAllApartments.controller";
import { addApartment } from "../controllers/addApartment.controller";
import { scrapeReviews } from "../controllers/scrapeReviews.controller";
import { getReviewRatings } from "../controllers/getReviewRatings.controller";
import bodyParser = require("body-parser");
import { patchApartment } from "../controllers/patchApartment.controller";
import { deleteApartment } from "../controllers/deleteApartment.controller";
import { getApartment } from "../controllers/getApartment.controller";

const apartmentsRouter = express.Router();

apartmentsRouter.get("/", getAllApartments);
apartmentsRouter.get("/:apartmentId", getApartment);
apartmentsRouter.get("/:apartmentId/scrapeReviews", scrapeReviews);
apartmentsRouter.get("/:apartmentId/getReviewRatings", getReviewRatings);

apartmentsRouter.post("/:apartmentId/add", bodyParser.json(), addApartment);

apartmentsRouter.patch(
	"/:apartmentId/patch",
	bodyParser.json(),
	patchApartment
);

apartmentsRouter.delete("/:apartmentId/delete", deleteApartment);


export default apartmentsRouter;
