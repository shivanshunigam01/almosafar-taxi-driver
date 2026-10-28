import { AuthGate } from "@/components/AuthGate";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
