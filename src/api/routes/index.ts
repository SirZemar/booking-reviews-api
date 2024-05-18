import * as express from "express";
import apartmentsRouter from "./apartments.route";
import { Timestamp, getFirestore } from "firebase-admin/firestore";
import { changeStatusDB } from "../services/firestore/apartments/apartments.service";

const router = express.Router();

router.use("/apartments", apartmentsRouter);

//TODO Remove
router.get("/test", async (req: express.Request, res: express.Response) => {
	const db = getFirestore();

	const result = await db
		.collection("apartments")
		.doc("la-maison-tito-fontes")
		.collection("reviews")
		.doc("02Zs7axrJutTWqJLKCwJ")
		.get();

	const seconds = await result.data()!.date._seconds;
	const nanoseconds = await result.data()!.date._nanoseconds;
	const time = new Timestamp(seconds, nanoseconds);
	return res.json(time);
});
router.get(
	"/changeStatus",
	async (req: express.Request, res: express.Response) => {
		try {
			await changeStatusDB();
			return res.json("done");
		} catch (error) {
			return res.send(error);
		}
	}
);
export default router;
