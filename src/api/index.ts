import * as express from "express";
import * as cors from "cors";
import routes from "./routes";

export const createServer = () => {
	const app: express.Express = express();
	app.use(
		cors({
			// credentials: true,
			origin: true,
		})
	);

	app.options("*", cors());
	app.use("/", routes);
	return app;
};
