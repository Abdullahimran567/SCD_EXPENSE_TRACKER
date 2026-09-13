import type { Metadata } from "next";
import AuthForm from "@/Components/AuthForm";

export const metadata: Metadata = {
  title: "Sign Up - SpendSmart",
  description: "Create your free SpendSmart expense tracker account.",
};

export default function SignPage() {
  return <AuthForm initialMode="signup" />;
}
