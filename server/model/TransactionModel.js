import { Schema, model } from "mongoose";

const transactionScema = new Schema({
	amount: { type: Number, required: true },
	category: { type: String, required: true },
	type: { type: String, required: true },
	date: { type: Date, required: true },
});

export const trModel = model("transaction", transactionScema);
