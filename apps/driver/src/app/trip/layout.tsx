import { AuthGate } from "@/components/AuthGate";

export default function TripLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
