import * as express from "express";
import * as cors from "cors";
import routes from "./routes";
import * as admin from "firebase-admin";

export const createServer = () => {
	const app: express.Express = express();
	admin.initializeApp();

	app.use(
		cors({
			// credentials: true,
			origin: [
				"http://localhost:4200",
				"https://adorable-horse-0a269a.netlify.app",
			],
		})
	);

	app.options("*", cors());
	app.use("/", routes);
	return app;
};
