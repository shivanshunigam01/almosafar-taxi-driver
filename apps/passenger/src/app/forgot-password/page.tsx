"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout, FieldLabel, PrimaryButton, TextInput } from "@/components/ui/AuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <AuthLayout title="Reset password" subtitle="Simulation only — no email is sent.">
      {sent ? (
        <p className="text-sm text-slate-600">
          If this were production, instructions would be sent to {email}. For the demo,{" "}
          <Link href="/login" className="text-brand underline">
            sign in
          </Link>{" "}
          with any password.
        </p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div>
            <FieldLabel>Email</FieldLabel>
            <TextInput value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </div>
          <PrimaryButton type="submit">Send reset link (demo)</PrimaryButton>
        </form>
      )}
    </AuthLayout>
  );
}
