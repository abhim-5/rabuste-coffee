import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter, Oswald } from "next/font/google";
import "./globals.css";
import PasswordProtection from "@/components/auth/PasswordProtection";
import AuthChecker from "@/components/auth/AuthChecker";
import { AuthProvider } from "@/hooks/useAuth";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});



export const metadata: Metadata = {
  title: "Rabuste Coffee - Surat's 1st Dark Roast Robusta Cafe",
  description: "Experience premium coffee, curated art gallery, inspiring workshops, and franchise opportunities at Rabuste. Surat's first and only dark roast robusta cafe offering bold, intense flavors.",
  keywords: ["Rabuste Coffee", "Dark Roast Coffee", "Robusta Coffee", "Surat Cafe", "Coffee Shop Surat", "Premium Coffee", "Art Gallery", "Coffee Workshops"],
  authors: [{ name: "Rabuste Coffee" }],
  creator: "Rabuste Coffee",
  publisher: "Rabuste Coffee",
  openGraph: {
    title: "Rabuste Coffee - Surat's 1st Dark Roast Robusta Cafe",
    description: "Experience Surat's 1st & Only Dark Roast Robusta Cafe. The boldest coffee in town, crafted for those who demand intensity and flavor.",
    type: "website",
    locale: "en_US",
    siteName: "Rabuste Coffee",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rabuste Coffee - Surat's 1st Dark Roast Robusta Cafe",
    description: "Experience premium dark roast robusta coffee, art gallery, and workshops at Rabuste.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/Rabuste logo.png",
    apple: "/Rabuste logo.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css?family=Satisfy|Open+Sans+Condensed:700,300" rel="stylesheet" />
      </head>
      <body
        className={`${playfair.variable} ${cormorant.variable} ${inter.variable} ${oswald.variable} antialiased overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <AuthChecker />
          <PasswordProtection>
            {children}
          </PasswordProtection>
        </AuthProvider>
      </body>
    </html>
  );
}
