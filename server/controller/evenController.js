import { Event } from "../model/eventModel.js";

export const getEvent = async (req, res) => {
	try {
		const allEvents = await Event.find();
		res.status(200).json(allEvents);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const createEvent = async (req, res) => {
	try {
		const newEvent = await Event.create(req.body);
		res.status(201).json(newEvent);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
