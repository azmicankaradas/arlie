import type { Metadata, Viewport } from "next";
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

const SITE_URL = "https://arlie.com.tr";

export const viewport: Viewport = {
  themeColor: "#1A1A1A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Arlie — Minimalist Takı",
    template: "%s | Arlie",
  },
  description:
    "Modern, zarif ve minimalist takı tasarımları. Sürdürülebilir lüks, zamansız zarafet. 925 ayar gümüş ve 18K altın kaplama koleksiyon.",
  keywords: [
    "minimalist takı",
    "gümüş yüzük",
    "altın kolye",
    "el yapımı küpe",
    "sürdürülebilir takı",
    "arlie",
  ],
  authors: [{ name: "Arlie" }],
  creator: "Arlie",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: "Arlie",
    title: "Arlie — Minimalist Takı",
    description:
      "Modern, zarif ve minimalist takı tasarımları. Sürdürülebilir lüks, zamansız zarafet.",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Arlie Minimalist Takı Koleksiyonu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arlie — Minimalist Takı",
    description:
      "Modern, zarif ve minimalist takı tasarımları. Sürdürülebilir lüks, zamansız zarafet.",
    images: ["/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/icons/icon-192x192.png",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Arlie",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Arlie",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Modern, zarif ve minimalist takı tasarımları. Sürdürülebilir lüks, zamansız zarafet.",
  sameAs: [],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-arlie-white text-arlie-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
