import * as express from "express";
import * as cors from "cors";
import routes from "./routes";
import * as admin from "firebase-admin";

export const createServer = () => {
	const app: express.Express = express();
	admin.initializeApp();

	app.use(
		cors({
			origin: ["https://booking-reviews.netlify.app", "http://localhost:4200"],
		})
	);

	app.options("*", cors());
	app.use("/", routes);
	return app;
};
