import type { Metadata } from "next";
import { Cormorant, Montserrat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Arlie — Minimalist Takı",
    template: "%s | Arlie",
  },
  description:
    "Modern, zarif ve minimalist takı tasarımları. Sürdürülebilir lüks, zamansız zarafet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${cormorant.variable} ${montserrat.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans bg-arlie-white text-arlie-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
