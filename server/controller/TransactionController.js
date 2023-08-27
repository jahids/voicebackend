import { trModel } from "../model/TransactionModel.js";

export const getTr = async (req, res) => {
	try {
		const allEvents = await trModel.find();
		res.status(200).json(allEvents);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const trcreate = async (req, res) => {
	try {
		const newEvent = await trModel.create(req.body);
		res.status(201).json(newEvent);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getExpenseIncomeStats = async (req, res) => {
	try {
		const maxExpense = await trModel
			.findOne({ type: "Expense" })
			.sort({ amount: -1 });
		const minExpense = await trModel
			.findOne({ type: "Expense" })
			.sort({ amount: 1 });
		const maxIncome = await trModel
			.findOne({ type: "Income" })
			.sort({ amount: -1 });
		const minIncome = await trModel
			.findOne({ type: "Income" })
			.sort({ amount: 1 });

		const stats = {
			maxExpenseAmount: maxExpense.amount,
			minExpenseAmount: minExpense.amount,
			maxIncomeAmount: maxIncome.amount,
			minIncomeAmount: minIncome.amount,
		};

		res.status(200).json(stats);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getLastTransactions = async (req, res) => {
	try {
		const lastIncomeTransactions = await trModel
			.find({ type: "Income" })
			.sort({ date: -1 })
			.limit(3);

		const lastExpenseTransactions = await trModel
			.find({ type: "Expense" })
			.sort({ date: -1 })
			.limit(3);

		const response = {
			lastIncome: lastIncomeTransactions,
			lastExpense: lastExpenseTransactions,
		};

		res.status(200).json(response);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deleteTransaction = async (req, res) => {
	try {
		const { id } = req.params;

		// Find the transaction by ID and delete it
		const deletedTransaction = await trModel.findByIdAndDelete(id);

		if (!deletedTransaction) {
			return res.status(404).json({ error: "Transaction not found" });
		}

		res.status(200).json({ message: "Transaction deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
