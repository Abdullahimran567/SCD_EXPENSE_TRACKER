import { VALID_TRANSACTION_TYPES } from "../constants/index.js";
import { ValidationError } from "../utils/errors.js";

export const transactionValidator = {
	validateCreation({ title, amount, type }) {
		if (!title || !title.trim() || amount === undefined || !type) {
			throw new ValidationError(
				"Please provide title, amount, and type (INCOME or EXPENSE).",
			);
		}

		const parsedAmount = parseFloat(amount);
		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			throw new ValidationError("Amount must be a positive number.");
		}

		const upperType = String(type).toUpperCase();
		if (!VALID_TRANSACTION_TYPES.includes(upperType)) {
			throw new ValidationError("Type must be either INCOME or EXPENSE.");
		}

		return {
			cleanTitle: title.trim(),
			parsedAmount,
			upperType,
		};
	},

	validateUpdateAmount(amount) {
		if (amount === undefined) return undefined;
		const parsedAmount = parseFloat(amount);
		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			throw new ValidationError("Amount must be a positive number");
		}
		return parsedAmount;
	},

	validateUpdateType(type) {
		if (!type) return undefined;
		const upperType = String(type).toUpperCase();
		if (VALID_TRANSACTION_TYPES.includes(upperType)) {
			return upperType;
		}
		return undefined;
	},

	validateTransactionId(transactionId) {
		if (!transactionId || !String(transactionId).trim()) {
			throw new ValidationError("Invalid transaction ID");
		}
		return String(transactionId).trim();
	},
};
