const { Ottoman } = require("ottoman");
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

exports.connectDB = async (appFunction) => {
	try {
		const ottoman = new Ottoman({ collectionName: "_default" });
		const connection = ottoman.connect({
			connectionString: "couchbase://localhost",
			bucketName: "issue-tracker",
			username: DB_USERNAME,
			password: DB_PASSWORD,
		});
		await connection.start();
		console.log("DB connected successfully");
		if (typeof appFunction === "function") appFunction();
	} catch (error) {
		console.error(error, "DB connection error!!!!");
		process.exit(1);
	}
};

exports.applyRoutes = (routes, router) => {
	routes.forEach((individualRoute) => {
		router.use(individualRoute.endpoint, individualRoute.route);
	});
};

exports.handleNotFound = (router) => {
	router.use((req, res, next) => {
		res.status(404).json({
			errors: [
				{
					msg: "Not found",
					status: "404",
				},
			],
		});
		next();
	});
};

exports.handlerServerError = (router) => {
	router.use((err, req, res, next) => {
		res.statusCode = 500;
		console.error(err);
		res.json({
			errors: [
				{
					msg: "Oops, Something went wrong from our end.",
					status: "500",
				},
			],
		});
		next(err);
	});
};
