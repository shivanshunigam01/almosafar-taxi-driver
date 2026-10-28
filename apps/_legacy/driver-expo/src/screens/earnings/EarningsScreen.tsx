import { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import {
  computeDriverEarnings,
  DEFAULT_CURRENCY,
  formatMoney,
  type CurrencyCode,
  type Ride,
} from "@almosafar/shared";
import { useAuth } from "../../context/AuthContext";
import { useDataService } from "../../context/DataServiceContext";
import { useLocale } from "../../context/LocaleContext";

function sumNet(rides: Ride[], moneyLocale: string): string {
  let minor = 0;
  let currency: CurrencyCode = DEFAULT_CURRENCY;
  for (const r of rides) {
    const gross = r.fareFinal?.total ?? r.fareEstimate?.total;
    if (!gross) continue;
    currency = gross.currency;
    minor += computeDriverEarnings(gross).driverNet.amountMinor;
  }
  return formatMoney({ currency, amountMinor: minor }, moneyLocale);
}

export default function EarningsScreen() {
  const { driver } = useAuth();
  const { service } = useDataService();
  const { t, moneyLocale } = useLocale();
  const [rides, setRides] = useState<Ride[]>([]);

  const load = useCallback(async () => {
    if (!driver) return;
    const list = await service.listRidesForDriver(driver.id);
    setRides(list.filter((r) => r.status === "completed"));
  }, [driver, service]);

  useEffect(() => {
    load();
  }, [load]);

  const { todayTotal, monthTotal } = useMemo(() => {
    const now = new Date();
    const dayKey = now.toISOString().slice(0, 10);
    const monthKey = now.toISOString().slice(0, 7);
    const completed = rides.filter((r) => r.completedAt);
    const today = completed.filter((r) => r.completedAt!.startsWith(dayKey));
    const month = completed.filter((r) => r.completedAt!.startsWith(monthKey));
    return {
      todayTotal: sumNet(today, moneyLocale),
      monthTotal: sumNet(month, moneyLocale),
    };
  }, [rides, moneyLocale]);

  return (
    <View style={tw`flex-1 bg-slate-50 pt-12 px-5`}>
      <Text style={tw`text-2xl font-bold text-slate-900 mb-6`}>{t("earnings")}</Text>
      <View style={tw`bg-white rounded-2xl p-5 border border-slate-200 mb-4`}>
        <Text style={tw`text-sm text-slate-500`}>{t("today")}</Text>
        <Text style={tw`text-3xl font-bold text-amber-600 mt-1`}>{todayTotal}</Text>
      </View>
      <View style={tw`bg-white rounded-2xl p-5 border border-slate-200`}>
        <Text style={tw`text-sm text-slate-500`}>{t("thisMonth")}</Text>
        <Text style={tw`text-3xl font-bold text-slate-900 mt-1`}>{monthTotal}</Text>
      </View>
      <Text style={tw`text-xs text-slate-500 mt-6`}>{t("demoCalcNote")}</Text>
    </View>
  );
}
