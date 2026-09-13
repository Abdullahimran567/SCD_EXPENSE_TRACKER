import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "SpendSmart - Expense Tracker & Budget Manager",
	description: "Track your expenses, set budgets, and gain deep financial insights effortlessly.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="scroll-smooth">
			<body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-600 selection:text-white`}>
				{children}
			</body>
		</html>
	);
}
