import type { Metadata } from "next";
import AuthForm from "@/Components/AuthForm";

export const metadata: Metadata = {
  title: "Login - SpendSmart",
  description: "Log into your SpendSmart expense tracker account.",
};

export default function LoginPage() {
  return <AuthForm initialMode="login" />;
}
