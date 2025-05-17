import { AuthForm } from "@/components/auth-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Todo App",
  description: "Sign in or create an account for Todo App",
};

export default function AuthPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AuthForm />
    </div>
  );
}