"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

const KEY = "almosafar.passenger.notifications";

type Notice = { id: string; title: string; body: string; at: string };

export default function NotificationsPage() {
  const { t } = useLocale();
  const [items, setItems] = useState<Notice[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setItems(JSON.parse(raw));
    else {
      const seed: Notice[] = [
        {
          id: "1",
          title: t("Welcome to Almosafar Taxi", "مرحباً بك في Almosafar Taxi"),
          body: t("Local demo — notifications are stored on this device only.", "تجريبي — الإشعارات على هذا الجهاز فقط."),
          at: new Date().toISOString(),
        },
      ];
      setItems(seed);
      localStorage.setItem(KEY, JSON.stringify(seed));
    }
  }, [t]);

  return (
    <div className="space-y-4 px-4 py-6">
      <Link href="/home" className="text-sm text-brand">
        ← {t("Back", "رجوع")}
      </Link>
      <h1 className="text-xl font-bold">{t("Notifications", "الإشعارات")}</h1>
      <ul className="space-y-3">
        {items.map((n) => (
          <li key={n.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="font-semibold">{n.title}</p>
            <p className="text-sm text-slate-600">{n.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
