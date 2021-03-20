const dotenv = require("dotenv");
dotenv.config();
const { connectDB } = require("./utils");
connectDB();

const express = require("express");
const { applyRoutes, handleNotFound, handlerServerError } = require("./utils");
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.send("Welcome to Issue Tracker");
});

applyRoutes(routes, app);

handleNotFound(app);
handlerServerError(app);

app.listen(PORT, () => {
	console.log(`API running at port ${PORT}`);
});
