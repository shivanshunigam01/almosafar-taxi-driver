"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  AuthLayout,
  FieldLabel,
  PrimaryButton,
  SocialAuthRow,
  TextInput,
} from "@/components/ui/AuthLayout";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState("+964 770 000 0001");
  const [email, setEmail] = useState("demo.passenger.sara@example.com");
  const [password, setPassword] = useState("demo");
  const [err, setErr] = useState("");

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Demo only — password is not stored. Use any value with a seeded email."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-semibold text-brand">
            Register
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await login(email, password);
            router.push("/home");
          } catch (ex) {
            setErr(ex instanceof Error ? ex.message : "Login failed");
          }
        }}
      >
        <div>
          <FieldLabel>Mobile number (demo)</FieldLabel>
          <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
        </div>
        <div>
          <FieldLabel>Email</FieldLabel>
          <TextInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
          />
        </div>
        <div>
          <FieldLabel>Password (demo)</FieldLabel>
          <TextInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <PrimaryButton type="submit">Sign in</PrimaryButton>
        <SocialAuthRow />
        <Link href="/forgot-password" className="block text-center text-sm text-brand">
          Forgot password (simulation)
        </Link>
      </form>
    </AuthLayout>
  );
}
