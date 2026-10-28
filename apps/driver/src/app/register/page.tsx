"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthLayout, FieldLabel, PrimaryButton, TextInput } from "@/components/ui/AuthLayout";

export default function DriverRegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+9647");

  return (
    <AuthLayout title="Driver registration" subtitle="Creates a local demo session only.">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const demoEmail = email.trim() || `driver.${Date.now()}@demo.local`;
          await login(demoEmail);
          localStorage.setItem(
            "almosafar.driver.profile",
            JSON.stringify({ name, phone, verificationStatus: "pending_demo" })
          );
          router.push("/onboarding");
        }}
      >
        <div>
          <FieldLabel>Full name</FieldLabel>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <FieldLabel>Mobile</FieldLabel>
          <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div>
          <FieldLabel>Email (optional)</FieldLabel>
          <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <PrimaryButton type="submit">Create demo profile</PrimaryButton>
        <Link href="/login" className="block text-center text-sm text-amber-400">
          Sign in instead
        </Link>
      </form>
    </AuthLayout>
  );
}
