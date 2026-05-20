import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZeMeet — Collaborative Interview",
  description: "Premium collaborative interview workspace inside ze[hire]",
};

/** Fullscreen ZeMeet — no dashboard AppShell */
export default function ZeMeetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
