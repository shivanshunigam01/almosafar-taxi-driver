"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdminData } from "../../context/AdminDataContext";
import { useAdminLocale } from "../../context/AdminLocaleContext";
import { LoginHero } from "../../components/layout/LoginHero";
import { useToast } from "../../components/ui/Toast";

export default function LoginPage() {
  const { admin, error, loading, forceLocal, setForceLocal, retry } = useAdminData();
  const { t, locale, setLocale } = useAdminLocale();
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("demo.admin@almosafar.example.com");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin) return;
    setBusy(true);
    try {
      await admin.signInAdmin(email, password);
      toast({
        variant: "success",
        title: t("loginWelcome"),
        description: t("loginSubtitle"),
      });
      router.replace("/dashboard");
    } catch (err) {
      toast({
        variant: "error",
        title: "Sign-in failed",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="center-page">
        <span className="loading-pulse">{t("loading")}</span>
      </div>
    );
  }

  return (
    <div className="login-layout-wrap">
      <div className="login-locale">
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as "en" | "ar")}
          aria-label={t("language")}
        >
          <option value="en">{t("en")}</option>
          <option value="ar">{t("ar")}</option>
        </select>
      </div>
      <div className="login-layout">
        <LoginHero />
        <div className="login-panel">
          <div className="card login-card">
            <h1>{t("loginWelcome")}</h1>
            <p className="muted login-subtitle">{t("loginSubtitle")}</p>
            <p className="muted" style={{ marginBottom: 16 }}>{t("demoDisclaimer")}</p>
            {error ? (
              <div className="card" style={{ marginBottom: 16, padding: 14, background: "#fef2f2" }}>
                <p className="error-text" style={{ margin: "0 0 10px" }}>{error}</p>
                <div className="toolbar" style={{ margin: 0 }}>
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() => {
                      retry();
                      toast({ variant: "info", title: "Local demo", description: "Admin uses in-memory demo data." });
                    }}
                  >
                    Retry
                  </button>
                  <button
                    type="button"
                    className="btn primary"
                    onClick={() => {
                      setForceLocal(true);
                      toast({
                        variant: "info",
                        title: "Local demo",
                        description: "Using in-memory demo data.",
                      });
                    }}
                  >
                    Use local demo
                  </button>
                </div>
              </div>
            ) : null}
            {!error || forceLocal ? (
              <form onSubmit={onSubmit}>
                <p className="muted" style={{ marginBottom: 16 }}>
                  {t("localDemoHint")}
                </p>
                <div className="form-row">
                  <label htmlFor="admin-email">{t("email")}</label>
                  <input
                    id="admin-email"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    placeholder="demo.admin@local.test"
                  />
                </div>
                <div className="form-row">
                  <label htmlFor="admin-password">{t("password")}</label>
                  <input
                    id="admin-password"
                    className="input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="btn primary block" disabled={busy || !admin}>
                  {busy ? t("loading") : t("login")}
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
