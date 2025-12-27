import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter, Oswald } from "next/font/google";
import "./globals.css";

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
  title: "Rabuste Coffee",
  description: "Experience premium coffee, curated art gallery, inspiring workshops, and franchise opportunities at Rabuste.",
  icons: {
    icon: "/Rabuste logo.png",
  },
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
        className={`${playfair.variable} ${cormorant.variable} ${inter.variable} ${oswald.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
