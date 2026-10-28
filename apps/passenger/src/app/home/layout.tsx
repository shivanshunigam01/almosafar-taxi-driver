import { BottomNav } from "@/components/BottomNav";
import { AuthGate } from "@/components/AuthGate";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="relative pb-16">{children}</div>
      <BottomNav />
    </AuthGate>
  );
}
