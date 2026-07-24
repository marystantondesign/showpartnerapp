import { Fascinate, Gilda_Display, Newsreader, Public_Sans, JetBrains_Mono } from "next/font/google";

export const fascinate = Fascinate({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fascinate",
  display: "swap",
});

export const gildaDisplay = Gilda_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gilda-display",
  display: "swap",
});

export const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-public-sans",
  display: "swap",
});

export const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const fontVariables = [
  fascinate.variable,
  gildaDisplay.variable,
  newsreader.variable,
  publicSans.variable,
  jetBrainsMono.variable,
].join(" ");
