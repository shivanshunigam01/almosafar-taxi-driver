"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout, FieldLabel, PrimaryButton, TextInput } from "@/components/ui/AuthLayout";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const phone =
    typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem("almosafar.passenger.pendingPhone")
      : null;

  return (
    <AuthLayout
      title="Verify mobile"
      subtitle={`Demo OTP — enter 123456. No SMS is sent${phone ? ` to ${phone}` : ""}.`}
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim() !== "123456") {
            alert("Demo code is 123456");
            return;
          }
          router.push("/home");
        }}
      >
        <div>
          <FieldLabel>One-time code</FieldLabel>
          <TextInput
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            placeholder="123456"
            maxLength={6}
          />
        </div>
        <PrimaryButton type="submit">Verify & open map</PrimaryButton>
      </form>
    </AuthLayout>
  );
}
