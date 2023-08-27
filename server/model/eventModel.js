import { Schema, model } from "mongoose";

const EventSchema = new Schema({
	title: { type: String, required: true },
	date: { type: Date, required: true },
	venue: { type: String, required: true },
});

export const Event = model("Event", EventSchema);
