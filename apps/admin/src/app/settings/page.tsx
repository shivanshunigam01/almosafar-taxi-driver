"use client";

import { useEffect, useState } from "react";
import type { AdminConfiguration } from "@almosafar/shared";
import { LocalStorageConfigRepository } from "@almosafar/demo-core";
import { useAdminData } from "../../context/AdminDataContext";
import { useAdminLocale } from "../../context/AdminLocaleContext";

const configRepo = new LocalStorageConfigRepository();

export default function SettingsPage() {
  const { admin } = useAdminData();
  const { t } = useAdminLocale();
  const [cfg, setCfg] = useState<AdminConfiguration | null>(null);

  useEffect(() => {
    admin?.getAdminConfiguration().then(setCfg);
  }, [admin]);

  return (
    <>
      <h1>{t("nav.settings")}</h1>
      {cfg ? (
        <section className="card">
          <h2>{cfg.appName}</h2>
          <p>Support: {cfg.supportEmail}</p>
          <p>Maintenance: {cfg.maintenanceMode ? "On" : "Off"}</p>
          <p>Demo enforced: {cfg.demoModeEnforced ? "Yes" : "No"}</p>
        </section>
      ) : null}
      <section className="card">
        <h2>Local demo</h2>
        <p className="muted">{admin?.syncLabel}</p>
        <p className="muted">
          Export/import applies to this admin browser only. It does not update passenger or driver
          sites on other ports or devices.
        </p>
        <div className="row" style={{ gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn secondary"
            onClick={() => {
              const json = configRepo.exportDemoJson();
              void navigator.clipboard.writeText(json);
              alert("Demo configuration JSON copied to clipboard.");
            }}
          >
            Export demo config (JSON)
          </button>
          <label className="btn secondary" style={{ cursor: "pointer" }}>
            Import demo config (JSON)
            <input
              type="file"
              accept="application/json,.json"
              hidden
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const text = await file.text();
                  configRepo.importDemoJson(text);
                  alert("Imported into this browser’s admin storage envelope. Reload to refresh UI.");
                } catch {
                  alert("Invalid demo configuration JSON.");
                }
                e.target.value = "";
              }}
            />
          </label>
          <button
            type="button"
            className="btn primary"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      </section>
    </>
  );
}
