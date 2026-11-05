export const TRANSACTION_TYPES = {
	INCOME: "INCOME",
	EXPENSE: "EXPENSE",
};

export const VALID_TRANSACTION_TYPES = [
	TRANSACTION_TYPES.INCOME,
	TRANSACTION_TYPES.EXPENSE,
];

export const PAGINATION = {
	DEFAULT_PAGE: 1,
	DEFAULT_LIMIT: 20,
	MAX_LIMIT: 100,
};

export const BUDGET_THRESHOLDS = {
	WARNING_PERCENT: 80,
	EXCEEDED_PERCENT: 100,
	DEFAULT_AMOUNT: 5000,
};

export const BUDGET_STATUS = {
	NORMAL: "normal",
	WARNING: "warning",
	EXCEEDED: "exceeded",
};

export const CATEGORY_COLORS = {
	Housing: "#6366f1",
	Food: "#10b981",
	Transport: "#f59e0b",
	Entertainment: "#ef4444",
	Bills: "#3b82f6",
	Others: "#cbd5e1",
	General: "#94a3b8",
};

export const MONTH_NAMES = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];
