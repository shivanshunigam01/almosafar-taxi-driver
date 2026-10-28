"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";
import { AuthLayout, FieldLabel, PrimaryButton, TextInput } from "@/components/ui/AuthLayout";

export default function RegisterPage() {
  const { register } = useAuth();
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+9647");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  return (
    <AuthLayout
      title="Create account"
      subtitle="Simulated registration — data stays in this browser."
      footer={
        <>
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-brand">
            Sign in
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!name.trim() || phone.trim().length < 8) {
            setErr("Enter your name and mobile number.");
            return;
          }
          try {
            await register(name.trim(), email.trim() || `${phone.replace(/\D/g, "")}@demo.local`, phone);
            sessionStorage.setItem("almosafar.passenger.pendingPhone", phone);
            router.push("/verify-otp");
          } catch (ex) {
            setErr(ex instanceof Error ? ex.message : "Registration failed");
          }
        }}
      >
        <div>
          <FieldLabel>Full name</FieldLabel>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <FieldLabel>Mobile number</FieldLabel>
          <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" required />
        </div>
        <div>
          <FieldLabel>Email (optional)</FieldLabel>
          <TextInput value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" />
        </div>
        <div>
          <FieldLabel>Language</FieldLabel>
          <select
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            value={locale}
            onChange={(e) => setLocale(e.target.value as "en" | "ar")}
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <PrimaryButton type="submit">Continue</PrimaryButton>
      </form>
    </AuthLayout>
  );
}
