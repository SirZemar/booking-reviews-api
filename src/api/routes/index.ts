import { getRevieRatesController } from "../controllers/reviewRates";
import * as express from "express";
import * as admin from "firebase-admin";
import { scrapeReviewsController } from "../controllers/scrapeReviews";
import { getApartmentsController } from "../controllers/getApartments";

admin.initializeApp();
// const db = admin.firestore();
const router = express.Router();

router.get("/", (req: express.Request, res: express.Response) => {
	res.send("Welcome to booking review rates api");
});

router.get("/apartments", getApartmentsController);
router.get("/scrapeReviews/:pageName", scrapeReviewsController);
router.get("/reviewRates/:pageName", getRevieRatesController);

export default router;
