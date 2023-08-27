import express from "express";
import { createEvent, getEvent } from "./controller/evenController.js";
import {
	deleteTransaction,
	getExpenseIncomeStats,
	getLastTransactions,
	getTr,
	trcreate,
} from "./controller/TransactionController.js";
import { trModel } from "./model/TransactionModel.js";
const router = express.Router();

router.get("/event", getEvent);
router.post("/event", createEvent);
router.get("/tr", getTr);
router.delete("/tr/:id", deleteTransaction);
router.get("/maxmin", getExpenseIncomeStats);
router.get("/last-transactions", getLastTransactions);
router.post("/tr", trcreate);
// predict expense and
router.post("/predict", async (req, res) => {
	try {
		const { amount } = req.body;

		// Fetch transaction data for prediction
		const transactions = await trModel.find({});
		// Calculate average amounts for Income and Expense transactions
		let totalIncome = 0;
		let totalExpense = 0;
		let countIncome = 0;
		let countExpense = 0;

		transactions.forEach((transaction) => {
			if (transaction.type === "Income") {
				totalIncome += transaction.amount;
				countIncome++;
			} else if (transaction.type === "Expense") {
				totalExpense += transaction.amount;
				countExpense++;
			}
		});

		const avgIncome = totalIncome / countIncome;
		const avgExpense = totalExpense / countExpense;

		// Make a prediction based on average amounts
		const predictedType = amount >= avgIncome ? "Income" : "Expense";

		res.json({ predictedType });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// suggestion depends on id
router.get("/suggestions/:userId", async (req, res) => {
	try {
		const userId = req.params.userId;

		// Fetch user's transaction history
		const transactions = await trModel.find({ userId });

		// Calculate average daily income and expense
		let totalIncome = 0;
		let totalExpense = 0;

		transactions.forEach((transaction) => {
			if (transaction.type === "Income") {
				totalIncome += transaction.amount;
			} else if (transaction.type === "Expense") {
				totalExpense += transaction.amount;
			}
		});

		const daysWithData = transactions.length;
		const averageDailyIncome = totalIncome / daysWithData;
		const averageDailyExpense = totalExpense / daysWithData;

		// Calculate potential savings
		const averageDailySavings = averageDailyIncome - averageDailyExpense;
		const monthlySavings = averageDailySavings * 30; // Assuming 30 days in a month
		const yearlySavings = monthlySavings * 12;

		// Prepare personalized suggestions
		const suggestions = {
			averageDailyIncome,
			averageDailyExpense,
			averageDailySavings,
			monthlySavings,
			yearlySavings,
		};

		res.json(suggestions);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// budget tips

router.get("/budget-tips/:userId", async (req, res) => {
	try {
		const userId = req.params.userId;

		// Fetch user's transaction history
		const transactions = await trModel.find({ userId });

		// Calculate total income and total expenses
		let totalIncome = 0;
		let totalExpense = 0;

		transactions.forEach((transaction) => {
			if (transaction.type === "Income") {
				totalIncome += transaction.amount;
			} else if (transaction.type === "Expense") {
				totalExpense += transaction.amount;
			}
		});

		// Calculate net savings
		const netSavings = totalIncome - totalExpense;

		// Prepare budget tips based on net savings
		let budgetTips = [];

		if (netSavings > 0) {
			budgetTips.push(
				"Congratulations! You're saving more than you spend."
			);
		} else if (netSavings < 0) {
			budgetTips.push("Consider cutting down on unnecessary expenses.");
		} else {
			budgetTips.push("Your income and expenses are balanced.");
		}

		// Return budget tips
		res.json({ budgetTips });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router;
