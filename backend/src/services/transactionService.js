import { transactionRepository as defaultTxRepo } from "../repositories/transactionRepository.js";
import { categoryRepository as defaultCatRepo } from "../repositories/categoryRepository.js";
import { transactionValidator } from "../utils/transactionValidator.js";
import { PAGINATION } from "../constants/index.js";
import { NotFoundError } from "../utils/errors.js";

export class TransactionService {
	constructor({
		transactionRepository = defaultTxRepo,
		categoryRepository = defaultCatRepo,
	} = {}) {
		this.transactionRepository = transactionRepository;
		this.categoryRepository = categoryRepository;
	}

	async createTransaction({
		userId,
		title,
		amount,
		type,
		categoryName,
		description,
		date,
	}) {
		const { cleanTitle, parsedAmount, upperType } =
			transactionValidator.validateCreation({
				title,
				amount,
				type,
			});

		const nameCategory = (categoryName || "General").trim();

		let category = await this.categoryRepository.findByName(nameCategory);

		if (!category) {
			category = await this.categoryRepository.create({
				name: nameCategory,
				type: upperType,
				user_id: userId,
			});
		}

		return this.transactionRepository.create({
			title: cleanTitle,
			amount: parsedAmount,
			type: upperType,
			description: description || null,
			date: date ? new Date(date) : new Date(),
			category_id: category.id,
			userId: userId,
		});
	}

	async getTransactions({
		userId,
		limit = PAGINATION.DEFAULT_LIMIT,
		page = PAGINATION.DEFAULT_PAGE,
	}) {
		const parsedLimit = parseInt(limit) || PAGINATION.DEFAULT_LIMIT;
		const parsedPage = parseInt(page) || PAGINATION.DEFAULT_PAGE;
		const skip = (parsedPage - 1) * parsedLimit;

		const transactions = await this.transactionRepository.findMany({
			where: { userId },
			orderBy: { date: "desc" },
			take: parsedLimit,
			skip: skip,
			includeCategory: true,
		});

		const totalCount = await this.transactionRepository.count({
			where: { userId },
		});

		return {
			count: transactions.length,
			total: totalCount,
			page: parsedPage,
			totalPages: Math.ceil(totalCount / parsedLimit),
			transactions,
		};
	}

	async updateTransaction({ userId, transactionId, data }) {
		const validTxId = transactionValidator.validateTransactionId(transactionId);

		const existing = await this.transactionRepository.findById(validTxId);
		if (!existing || existing.userId !== userId) {
			throw new NotFoundError("Transaction not found");
		}

		const updateData = {};

		if (data.title) {
			updateData.title = data.title.trim();
		}

		const validAmount = transactionValidator.validateUpdateAmount(data.amount);
		if (validAmount !== undefined) {
			updateData.amount = validAmount;
		}

		const validType = transactionValidator.validateUpdateType(data.type);
		if (validType !== undefined) {
			updateData.type = validType;
		}

		if (data.description !== undefined) {
			updateData.description = data.description || null;
		}

		if (data.date) {
			updateData.date = new Date(data.date);
		}

		if (data.categoryName) {
			const nameCategory = data.categoryName.trim();
			let category = await this.categoryRepository.findByName(nameCategory);

			if (!category) {
				category = await this.categoryRepository.create({
					name: nameCategory,
					type: updateData.type || existing.type,
					user_id: userId,
				});
			}
			updateData.category_id = category.id;
		}

		return this.transactionRepository.update(validTxId, updateData);
	}

	async deleteTransaction({ userId, transactionId }) {
		const validTxId = transactionValidator.validateTransactionId(transactionId);

		const existing = await this.transactionRepository.findById(validTxId);
		if (!existing || existing.userId !== userId) {
			throw new NotFoundError("Transaction not found");
		}

		await this.transactionRepository.delete(validTxId);
		return true;
	}
}

export const transactionService = new TransactionService();
