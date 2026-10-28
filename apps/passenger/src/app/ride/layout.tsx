import { AuthGate } from "@/components/AuthGate";

export default function RideLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
