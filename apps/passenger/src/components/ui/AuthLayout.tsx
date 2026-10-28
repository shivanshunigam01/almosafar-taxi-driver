"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AlmosafarLogo } from "@almosafar/ui";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-[calc(100dvh-3rem)] bg-gradient-to-b from-blue-50 to-slate-50 px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <AlmosafarLogo size="lg" variant="light" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-slate-600">{subtitle}</p> : null}
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50">
          {children}
        </div>
        {footer ? <div className="mt-6 text-center text-sm text-slate-600">{footer}</div> : null}
        <p className="mt-8 text-center text-xs text-slate-400">
          <Link href="/" className="underline">
            Back to splash
          </Link>
        </p>
      </div>
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-1 block text-sm font-medium text-slate-700">{children}</label>;
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-blue-600/20 ${props.className ?? ""}`}
    />
  );
}

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`btn-brand w-full ${props.className ?? ""}`}
    />
  );
}

export function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-800 hover:bg-slate-50 ${props.className ?? ""}`}
    />
  );
}

export function SocialAuthRow() {
  return (
    <div className="mt-4 space-y-2">
      <p className="text-center text-xs text-slate-400">Or continue with (demo)</p>
      <div className="flex gap-2">
        <SecondaryButton type="button" onClick={() => alert("Google sign-in is not wired in demo mode.")}>
          Google
        </SecondaryButton>
        <SecondaryButton type="button" onClick={() => alert("Apple sign-in is not wired in demo mode.")}>
          Apple
        </SecondaryButton>
      </div>
    </div>
  );
}
