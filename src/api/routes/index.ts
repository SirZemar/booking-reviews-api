import * as express from "express";
import apartmentsRouter from "./apartments.route";

const router = express.Router();

router.use("/apartments", apartmentsRouter);

export default router;
