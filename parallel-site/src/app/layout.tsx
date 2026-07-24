import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Parallel — Meet yourself.",
  description:
    "Text, call, and video with verified versions of yourself in neighboring realities. Included with every Parallel account.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
