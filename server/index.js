import express from "express";
const app = express();
import cors from "cors";
import mongoose from "mongoose";
import router from "./route.js";

const port = 5000;

app.use(cors());
app.use(express.json());
app.use(router);

mongoose
	.connect(
		"mongodb+srv://evanjahid321:12345@cluster0.k520vqm.mongodb.net/?retryWrites=true&w=majority",
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => {
		console.log("Connected to Mongoose");
		app.listen(port, () => {
			console.log(`Server running at http://localhost:${port}`);
		});
	})
	.catch((error) => {
		console.error("Error connecting to MongoDB:", error);
	});
