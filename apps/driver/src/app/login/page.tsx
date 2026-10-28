"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthLayout, FieldLabel, PrimaryButton, TextInput } from "@/components/ui/AuthLayout";

export default function DriverLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("demo.driver.khalid@example.com");

  return (
    <AuthLayout
      title="Driver sign in"
      subtitle="Demo — pick a seeded driver email. No password stored."
      footer={
        <>
          New driver?{" "}
          <Link href="/register" className="font-semibold text-amber-400">
            Register
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          await login(email);
          router.push("/dashboard");
        }}
      >
        <div>
          <FieldLabel>Email</FieldLabel>
          <TextInput value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" />
        </div>
        <PrimaryButton type="submit">Continue to dashboard</PrimaryButton>
      </form>
    </AuthLayout>
  );
}
