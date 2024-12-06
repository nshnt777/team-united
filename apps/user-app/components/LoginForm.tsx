"use client";

import { loginSchema } from "@repo/validation/login";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthCard from "./AuthCard";
import LabelledInput from "./LabelledInput";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function handleLogIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validData = loginSchema.safeParse({ email, password });
    if (!validData.success) {
      setError("Invalid inputs");
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    if (result?.ok) {
      router.push('/home');
      return;
    }
    console.error("Error during registration:", error);
    setError("User does not exist");
  };

  return (
    <AuthCard handleSubmit={handleLogIn} pageType="Log in" error={error}>
      <LabelledInput
        label="Email"
        type="email"
        placeholder="Enter your email"
        name="email"
        onChange={(e) => {
          setEmail(e.target.value)
        }}
      />
      <LabelledInput
        label="Password"
        type="password"
        placeholder=""
        name="email"
        onChange={(e) => {
          setPassword(e.target.value)
        }}
      />
    </AuthCard>
  );
}
