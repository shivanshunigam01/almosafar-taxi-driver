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
    <div className="min-h-[calc(100dvh-3rem)] bg-gradient-to-b from-[#0c1222] to-[#1e293b] px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <AlmosafarLogo size="lg" variant="dark" />
          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-blue-400">Driver</p>
          <h1 className="mt-2 text-2xl font-bold text-white">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
          {children}
        </div>
        {footer ? <div className="mt-6 text-center text-sm text-slate-400">{footer}</div> : null}
        <p className="mt-8 text-center text-xs text-slate-500">
          <Link href="/" className="underline">
            Back
          </Link>
        </p>
      </div>
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-1 block text-sm font-medium text-slate-300">{children}</label>;
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-base text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 ${props.className ?? ""}`}
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
