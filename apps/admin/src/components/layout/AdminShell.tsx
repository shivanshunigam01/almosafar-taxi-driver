"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DemoBanner } from "@almosafar/ui";
import { DEMO_DISCLAIMER, resolveDemoMode } from "@almosafar/shared";
import { useAdminData } from "../../context/AdminDataContext";
import { useAdminLocale } from "../../context/AdminLocaleContext";

const NAV: { href: string; key: `nav.${string}`; icon: string }[] = [
  { href: "/dashboard", key: "nav.dashboard", icon: "◈" },
  { href: "/rides", key: "nav.rides", icon: "◎" },
  { href: "/passengers", key: "nav.passengers", icon: "◇" },
  { href: "/drivers", key: "nav.drivers", icon: "◆" },
  { href: "/vehicles", key: "nav.vehicles", icon: "▣" },
  { href: "/fares", key: "nav.fares", icon: "¤" },
  { href: "/zones", key: "nav.zones", icon: "◉" },
  { href: "/pricing", key: "nav.pricing", icon: "％" },
  { href: "/bookings", key: "nav.bookings", icon: "☰" },
  { href: "/payments", key: "nav.payments", icon: "₪" },
  { href: "/reports", key: "nav.reports", icon: "▤" },
  { href: "/settings", key: "nav.settings", icon: "⚙" },
  { href: "/activity", key: "nav.activity", icon: "◷" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, loading } = useAdminData();
  const { t, locale, setLocale, isRtl } = useAdminLocale();
  const [authed, setAuthed] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const demoMode = resolveDemoMode({
    NEXT_PUBLIC_ALMOSAFAR_DEMO_MODE: process.env.NEXT_PUBLIC_ALMOSAFAR_DEMO_MODE,
    NODE_ENV: process.env.NODE_ENV,
  });

  useEffect(() => {
    if (!admin) return;
    setAuthed(!!admin.getAdminSession());
    return admin.subscribeAdminSession((s) => setAuthed(!!s));
  }, [admin]);

  useEffect(() => {
    if (!loading && admin && !authed && pathname !== "/login") {
      router.replace("/login");
    }
  }, [loading, admin, authed, pathname, router]);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

  if (loading || !admin) {
    return (
      <div className="center-page">
        <span className="loading-pulse">{t("loading")}</span>
      </div>
    );
  }

  if (!authed && pathname !== "/login") {
    return (
      <div className="center-page">
        <span className="loading-pulse">{t("loading")}</span>
      </div>
    );
  }

  if (pathname === "/login") {
    return <>{children}</>;
  }

  const currentTitle =
    NAV.find((item) => item.href === pathname)?.key ?? "nav.dashboard";

  return (
    <div className="app-layout">
      {demoMode ? (
        <div className="demo-banner-slot">
          <DemoBanner disclaimer={DEMO_DISCLAIMER} />
        </div>
      ) : null}
      <header className="mobile-topbar">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setNavOpen((o) => !o)}
          aria-expanded={navOpen}
          aria-label="Open menu"
        >
          {navOpen ? "✕" : "☰"}
        </button>
        <span className="mobile-topbar-title">
          {t(currentTitle as `nav.${keyof typeof import("../../i18n/en").en.nav}`)}
        </span>
      </header>
      <div
        className={`sidebar-backdrop ${navOpen ? "open" : ""}`}
        onClick={() => setNavOpen(false)}
        aria-hidden={!navOpen}
      />
      <div className={`app-shell ${isRtl ? "rtl" : ""}`}>
        <aside className={`sidebar ${navOpen ? "open" : ""}`}>
          <div className="brand">{t("appName")}</div>
          <p className="sync-label">
            {t("syncLocal")}
          </p>
          <nav>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? "nav-link active" : "nav-link"}
              >
                <span className="nav-icon" aria-hidden>{item.icon}</span>
                {t(item.key as `nav.${keyof typeof import("../../i18n/en").en.nav}`)}
              </Link>
            ))}
          </nav>
          <div className="sidebar-footer">
            <label className="locale-picker">
              {t("language")}
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as "en" | "ar")}
              >
                <option value="en">{t("en")}</option>
                <option value="ar">{t("ar")}</option>
              </select>
            </label>
            <button
              type="button"
              className="btn secondary"
              onClick={async () => {
                await admin.signOutAdmin();
                router.replace("/login");
              }}
            >
              {t("logout")}
            </button>
          </div>
        </aside>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
