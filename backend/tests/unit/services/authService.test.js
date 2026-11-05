import { jest } from "@jest/globals";
import { AuthService } from "../../src/services/authService.js";
import { ValidationError, AuthError, NotFoundError } from "../../src/utils/errors.js";

describe("AuthService Unit Tests (Mocked UserRepository)", () => {
	let mockUserRepo;
	let authService;

	beforeEach(() => {
		mockUserRepo = {
			findByEmail: jest.fn(),
			findById: jest.fn(),
			create: jest.fn(),
		};
		authService = new AuthService({ userRepository: mockUserRepo });
	});

	describe("signup", () => {
		it("throws ValidationError when fields are missing", async () => {
			await expect(
				authService.signup({ name: "", email: "a@b.com", password: "123" }),
			).rejects.toThrow(ValidationError);
		});

		it("throws ValidationError when password is less than 6 chars", async () => {
			await expect(
				authService.signup({ name: "Alice", email: "a@b.com", password: "123" }),
			).rejects.toThrow(ValidationError);
		});

		it("throws ValidationError when user already exists", async () => {
			mockUserRepo.findByEmail.mockResolvedValue({ id: "user-1", email: "a@b.com" });
			await expect(
				authService.signup({ name: "Alice", email: "a@b.com", password: "password123" }),
			).rejects.toThrow("User with this email already exists.");
		});

		it("creates user and returns token on valid inputs", async () => {
			mockUserRepo.findByEmail.mockResolvedValue(null);
			mockUserRepo.create.mockResolvedValue({
				id: "user-1",
				name: "Alice",
				email: "a@b.com",
				created_at: new Date(),
			});

			const res = await authService.signup({
				name: "Alice",
				email: "a@b.com",
				password: "password123",
			});

			expect(res.user.id).toBe("user-1");
			expect(res.token).toBeDefined();
			expect(mockUserRepo.create).toHaveBeenCalled();
		});
	});

	describe("login", () => {
		it("throws ValidationError when email or password missing", async () => {
			await expect(authService.login({ email: "", password: "123" })).rejects.toThrow(
				ValidationError,
			);
		});

		it("throws AuthError when user not found", async () => {
			mockUserRepo.findByEmail.mockResolvedValue(null);
			await expect(
				authService.login({ email: "notfound@b.com", password: "password123" }),
			).rejects.toThrow(AuthError);
		});
	});

	describe("getMe", () => {
		it("throws NotFoundError when user record does not exist", async () => {
			mockUserRepo.findById.mockResolvedValue(null);
			await expect(authService.getMe("nonexistent")).rejects.toThrow(NotFoundError);
		});

		it("returns user profile when user exists", async () => {
			mockUserRepo.findById.mockResolvedValue({
				id: "user-123",
				name: "Alice",
				email: "alice@test.com",
				created_at: new Date(),
			});

			const user = await authService.getMe("user-123");
			expect(user.id).toBe("user-123");
			expect(user.name).toBe("Alice");
		});
	});
});
