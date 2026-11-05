import { jest } from "@jest/globals";
import { CategoryService } from "../../../src/services/categoryService.js";
import { ValidationError } from "../../../src/utils/errors.js";

describe("CategoryService Unit Tests (Mocked CategoryRepository)", () => {
	let mockCatRepo;
	let categoryService;

	beforeEach(() => {
		mockCatRepo = {
			findByNameAndUserId: jest.fn(),
			findByUserId: jest.fn(),
			create: jest.fn(),
		};
		categoryService = new CategoryService({ categoryRepository: mockCatRepo });
	});

	describe("createCategory", () => {
		it("throws ValidationError when category name is missing", async () => {
			await expect(
				categoryService.createCategory({ userId: "u1", name: "   ", type: "EXPENSE" }),
			).rejects.toThrow(ValidationError);
		});

		it("returns existing category if already present for user", async () => {
			mockCatRepo.findByNameAndUserId.mockResolvedValue({
				id: "cat-1",
				name: "Food",
				type: "EXPENSE",
				user_id: "u1",
			});

			const res = await categoryService.createCategory({
				userId: "u1",
				name: "Food",
				type: "EXPENSE",
			});

			expect(res.isExisting).toBe(true);
			expect(res.category.id).toBe("cat-1");
			expect(mockCatRepo.create).not.toHaveBeenCalled();
		});

		it("creates new category when not existing", async () => {
			mockCatRepo.findByNameAndUserId.mockResolvedValue(null);
			mockCatRepo.create.mockResolvedValue({
				id: "cat-new",
				name: "Travel",
				type: "EXPENSE",
				user_id: "u1",
			});

			const res = await categoryService.createCategory({
				userId: "u1",
				name: "Travel",
				type: "EXPENSE",
			});

			expect(res.isExisting).toBe(false);
			expect(res.category.name).toBe("Travel");
			expect(mockCatRepo.create).toHaveBeenCalled();
		});
	});

	describe("getCategories", () => {
		it("combines user categories with system defaults", async () => {
			mockCatRepo.findByUserId.mockResolvedValue([
				{ id: "c1", name: "Food", type: "EXPENSE", user_id: "u1" },
			]);

			const categories = await categoryService.getCategories("u1");
			expect(categories.some((c) => c.name === "Food" && c.id === "c1")).toBe(true);
			expect(categories.some((c) => c.name === "Housing" && c.isDefault)).toBe(true);
		});
	});
});
