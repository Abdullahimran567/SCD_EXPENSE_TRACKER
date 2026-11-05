import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Configuration and Startup Fail-Fast", () => {
	it("refuses to start when JWT_SECRET is missing", (done) => {
		const appPath = path.resolve(__dirname, "../src/index.js");

		const env = {
			...process.env,
			JWT_SECRET: "",
			MONGODB_URI: "mongodb://localhost:27017/Expense_Tracker_test",
		};
		delete env.JWT_SECRET;

		const child = spawn(process.execPath, [appPath], {
			env,
			cwd: path.resolve(__dirname, "../../"),
		});

		let stderr = "";
		let stdout = "";

		child.stderr.on("data", (data) => {
			stderr += data.toString();
		});

		child.stdout.on("data", (data) => {
			stdout += data.toString();
		});

		child.on("close", (code) => {
			expect(code).not.toBe(0);
			const combined = stdout + stderr;
			expect(combined).toContain("[Config Error] Missing required environment variable: JWT_SECRET");
			done();
		});
	});

	it("refuses to start when MONGODB_URI is missing", (done) => {
		const appPath = path.resolve(__dirname, "../src/index.js");

		const env = {
			...process.env,
			JWT_SECRET: "test_secret",
		};
		delete env.MONGODB_URI;

		const child = spawn(process.execPath, [appPath], {
			env,
			cwd: path.resolve(__dirname, "../../"),
		});

		let stderr = "";
		let stdout = "";

		child.stderr.on("data", (data) => {
			stderr += data.toString();
		});

		child.stdout.on("data", (data) => {
			stdout += data.toString();
		});

		child.on("close", (code) => {
			expect(code).not.toBe(0);
			const combined = stdout + stderr;
			expect(combined).toContain("[Config Error] Missing required environment variable: MONGODB_URI");
			done();
		});
	});
});
