"use client";

import { useState } from "react";
import Link from "next/link";
import {
	Wallet,
	TrendingUp,
	TrendingDown,
	PieChart,
	Zap,
	ArrowRight,
	Plus,
	CheckCircle2,
	BarChart3,
	DollarSign,
	Lock,
	Coffee,
	ShoppingCart,
	Laptop,
	Utensils,
} from "lucide-react";

export default function LandingPage() {
	// Live Demo Widget State
	const [transactions, setTransactions] = useState([
		{
			id: 1,
			title: "Tech Subscriptions",
			category: "Software",
			amount: 49.99,
			type: "EXPENSE",
			date: "Today, 2:15 PM",
			icon: Laptop,
		},
		{
			id: 2,
			title: "Client Payment",
			category: "Income",
			amount: 1250.0,
			type: "INCOME",
			date: "Today, 10:30 AM",
			icon: DollarSign,
		},
		{
			id: 3,
			title: "Grocery Store",
			category: "Food & Dining",
			amount: 84.2,
			type: "EXPENSE",
			date: "Yesterday",
			icon: ShoppingCart,
		},
		{
			id: 4,
			title: "Coffee House",
			category: "Food & Dining",
			amount: 6.5,
			type: "EXPENSE",
			date: "Yesterday",
			icon: Coffee,
		},
	]);

	const [demoTitle, setDemoTitle] = useState("");
	const [demoAmount, setDemoAmount] = useState("");
	const [demoType, setDemoType] = useState<"EXPENSE" | "INCOME">("EXPENSE");

	const handleAddDemoTransaction = (e: React.FormEvent) => {
		e.preventDefault();
		if (!demoTitle || !demoAmount) return;

		const numAmount = parseFloat(demoAmount);
		if (isNaN(numAmount) || numAmount <= 0) return;

		const newTx = {
			id: Date.now(),
			title: demoTitle,
			category: demoType === "INCOME" ? "Income" : "General",
			amount: numAmount,
			type: demoType,
			date: "Just now",
			icon: demoType === "INCOME" ? DollarSign : Utensils,
		};

		setTransactions([newTx, ...transactions]);
		setDemoTitle("");
		setDemoAmount("");
	};

	const totalIncome = transactions
		.filter((t) => t.type === "INCOME")
		.reduce((acc, t) => acc + t.amount, 0);

	const totalExpense = transactions
		.filter((t) => t.type === "EXPENSE")
		.reduce((acc, t) => acc + t.amount, 0);

	const netBalance = 5400 + totalIncome - totalExpense;

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
			{/* HEADER / NAVIGATION */}
			<header className="sticky top-0 z-50 bg-white border-b border-slate-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2.5">
						<div className="p-2 bg-emerald-600 text-white rounded-lg shadow-xs">
							<Wallet className="w-5 h-5" />
						</div>
						<span className="text-xl font-bold text-slate-900">
							Spend<span className="text-emerald-600">Smart</span>
						</span>
					</Link>

					{/* Navigation Links */}
					<nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
						<a href="#features" className="hover:text-emerald-600 transition">
							Features
						</a>
					</nav>

					{/* Auth Action Buttons */}
					<div className="flex items-center gap-3">
						<Link
							href="/login"
							className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
						>
							Sign In
						</Link>
						<Link
							href="/sign"
							className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs flex items-center gap-1.5 transition"
						>
							<span>Get Started</span>
							<ArrowRight className="w-4 h-4" />
						</Link>
					</div>
				</div>
			</header>

			{/* HERO SECTION */}
			<section className="pt-12 pb-16 md:pt-16 md:pb-24 bg-white border-b border-slate-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center max-w-3xl mx-auto space-y-5">
						{/* Pill Badge */}
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
							<span>Simple Expense Tracker and Budgeting App</span>
						</div>

						{/* Main Headline */}
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
							Master Your Money. <br />
							<span className="text-emerald-600">
								Track Expenses in Seconds.
							</span>
						</h1>

						{/* Subtitle */}
						<p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
							Take charge of your personal finances with quick expense logging,
							budget tracking, and real-time balance calculations.
						</p>

						{/* CTAs */}
						<div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
							<Link
								href="/sign"
								className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-xs flex items-center justify-center gap-2 transition"
							>
								<span>Get Started Free</span>
								<ArrowRight className="w-4 h-4" />
							</Link>

							<Link
								href="/login"
								className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium rounded-lg flex items-center justify-center gap-2 transition"
							>
								<Lock className="w-4 h-4 text-slate-500" />
								<span>Existing User? Log In</span>
							</Link>
						</div>

						{/* Trust highlights */}
						<div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
							<span className="flex items-center gap-1.5">
								<CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free &
								Easy Setup
							</span>
							<span className="flex items-center gap-1.5">
								<CheckCircle2 className="w-4 h-4 text-emerald-600" /> Secure JWT
								Auth
							</span>
						</div>
					</div>

					{/* HERO APP PREVIEW */}
					<div className="mt-12 max-w-4xl mx-auto">
						<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
							<div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 rounded-full bg-rose-400" />
									<div className="w-3 h-3 rounded-full bg-amber-400" />
									<div className="w-3 h-3 rounded-full bg-emerald-400" />
									<span className="ml-2 text-xs text-slate-400 font-mono">
										Dashboard Preview
									</span>
								</div>
								<span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
									Live Sync
								</span>
							</div>

							{/* Grid Widgets */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
								{/* Total Balance */}
								<div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
									<div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
										<span>Total Balance</span>
										<Wallet className="w-4 h-4 text-emerald-600" />
									</div>
									<div className="text-2xl font-bold text-slate-900">
										$
										{netBalance.toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</div>
									<div className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
										<TrendingUp className="w-3.5 h-3.5" />
										<span>Updated just now</span>
									</div>
								</div>

								{/* Total Income */}
								<div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
									<div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
										<span>Monthly Income</span>
										<TrendingUp className="w-4 h-4 text-teal-600" />
									</div>
									<div className="text-2xl font-bold text-slate-900">
										$
										{(4200 + totalIncome).toLocaleString(undefined, {
											minimumFractionDigits: 2,
										})}
									</div>
								</div>

								{/* Total Expense */}
								<div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
									<div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
										<span>Monthly Expenses</span>
										<TrendingDown className="w-4 h-4 text-rose-500" />
									</div>
									<div className="text-2xl font-bold text-slate-900">
										$
										{(1120 + totalExpense).toLocaleString(undefined, {
											minimumFractionDigits: 2,
										})}
									</div>
								</div>
							</div>

							{/* Progress Bar */}
							<div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-col gap-1.5">
								<div className="flex justify-between text-xs text-slate-600 font-medium">
									<span>Monthly Spending Limit ($3,500.00)</span>
									<span className="text-emerald-700 font-semibold">
										32.8% used
									</span>
								</div>
								<div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
									<div className="bg-emerald-600 h-full rounded-full w-[32.8%]" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* LIVE INTERACTIVE DEMO WIDGET */}
			<section
				id="demo"
				className="py-16 bg-slate-100 border-b border-slate-200"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center max-w-2xl mx-auto mb-10">
						<h2 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
							Interactive Preview
						</h2>
						<h3 className="text-2xl font-bold text-slate-900">
							Try Adding an Expense Live
						</h3>
						<p className="text-slate-600 text-sm mt-1">
							Add a dummy transaction below and watch your balance update
							instantly.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-4xl mx-auto">
						{/* Input Form Box */}
						<div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
							<h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
								<Plus className="w-4 h-4 text-emerald-600" />
								<span>Add Quick Transaction</span>
							</h4>

							<form onSubmit={handleAddDemoTransaction} className="space-y-3">
								<div>
									<label className="block text-xs font-medium text-slate-700 mb-1">
										Title
									</label>
									<input
										type="text"
										required
										placeholder="e.g. Supermarket, Salary"
										value={demoTitle}
										onChange={(e) => setDemoTitle(e.target.value)}
										className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
									/>
								</div>

								<div className="grid grid-cols-2 gap-2.5">
									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">
											Amount ($)
										</label>
										<input
											type="number"
											step="0.01"
											required
											placeholder="0.00"
											value={demoAmount}
											onChange={(e) => setDemoAmount(e.target.value)}
											className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
										/>
									</div>

									<div>
										<label className="block text-xs font-medium text-slate-700 mb-1">
											Type
										</label>
										<select
											value={demoType}
											onChange={(e) =>
												setDemoType(e.target.value as "EXPENSE" | "INCOME")
											}
											className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
										>
											<option value="EXPENSE">Expense (-)</option>
											<option value="INCOME">Income (+)</option>
										</select>
									</div>
								</div>

								<button
									type="submit"
									className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition"
								>
									<Plus className="w-4 h-4" />
									<span>Add Transaction</span>
								</button>
							</form>
						</div>

						{/* Live Feed List Box */}
						<div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
							<div className="flex items-center justify-between mb-3">
								<h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
									<BarChart3 className="w-4 h-4 text-emerald-600" />
									<span>Recent Activity Feed</span>
								</h4>
								<span className="text-xs text-slate-500">
									{transactions.length} items
								</span>
							</div>

							<div className="space-y-2.5 overflow-y-auto max-h-[260px] pr-1">
								{transactions.map((t) => {
									const Icon = t.icon || DollarSign;
									return (
										<div
											key={t.id}
											className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
										>
											<div className="flex items-center gap-3">
												<div
													className={`p-2 rounded-md ${t.type === "INCOME" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
												>
													<Icon className="w-4 h-4" />
												</div>
												<div>
													<div className="text-xs font-semibold text-slate-900">
														{t.title}
													</div>
													<div className="text-[11px] text-slate-500">
														{t.category} • {t.date}
													</div>
												</div>
											</div>

											<div
												className={`text-xs font-bold ${t.type === "INCOME" ? "text-emerald-600" : "text-slate-900"}`}
											>
												{t.type === "INCOME" ? "+" : "-"}${t.amount.toFixed(2)}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* FEATURES SECTION */}
			<section
				id="features"
				className="py-16 bg-white border-b border-slate-200"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center max-w-2xl mx-auto mb-12">
						<h2 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
							Features
						</h2>
						<h3 className="text-2xl font-bold text-slate-900">
							Simple Tools for Money Management
						</h3>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
						{/* Feature 1 */}
						<div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
							<div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg w-fit mb-4 border border-emerald-200">
								<Zap className="w-5 h-5" />
							</div>
							<h4 className="text-lg font-bold text-slate-900 mb-1">
								Instant Expense Logging
							</h4>
							<p className="text-slate-600 text-sm leading-relaxed">
								Log purchases with category tags and amounts in seconds from any
								device.
							</p>
						</div>

						{/* Feature 2 */}
						<div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
							<div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg w-fit mb-4 border border-emerald-200">
								<PieChart className="w-5 h-5" />
							</div>
							<h4 className="text-lg font-bold text-slate-900 mb-1">
								Visual Budget Breakdown
							</h4>
							<p className="text-slate-600 text-sm leading-relaxed">
								Set monthly spending limits and monitor progress with clean
								visual indicators.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CALL TO ACTION BANNER */}
			<section className="py-16 bg-slate-50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div className="bg-slate-900 text-white rounded-xl p-8 sm:p-12 shadow-sm">
						<h3 className="text-2xl sm:text-3xl font-bold mb-3">
							Ready to Manage Your Money Smartly?
						</h3>
						<p className="text-slate-300 max-w-lg mx-auto text-sm mb-6">
							Create your account today and start tracking income and expenses
							effortlessly.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-3">
							<Link
								href="/sign"
								className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg shadow-xs flex items-center justify-center gap-2 transition"
							>
								<span>Create Free Account</span>
								<ArrowRight className="w-4 h-4" />
							</Link>
							<Link
								href="/login"
								className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm rounded-lg transition"
							>
								Sign In
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* FOOTER */}
			<footer className="border-t border-slate-200 bg-white py-8 text-slate-500 text-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<div className="p-1.5 bg-emerald-600 text-white rounded-md">
							<Wallet className="w-4 h-4" />
						</div>
						<span className="font-bold text-slate-900 text-sm">SpendSmart</span>
					</div>

					<div className="flex items-center gap-5 text-xs text-slate-600">
						<Link href="/login" className="hover:text-emerald-600 transition">
							Log In
						</Link>
						<Link href="/sign" className="hover:text-emerald-600 transition">
							Sign Up
						</Link>
						<a href="#features" className="hover:text-emerald-600 transition">
							Features
						</a>
						<a href="#demo" className="hover:text-emerald-600 transition">
							Live Demo
						</a>
					</div>

					<div className="text-xs text-slate-400">
						© {new Date().getFullYear()} SpendSmart. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}
