import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "./lib/providers";
// import Appbar from "../components/Appbar";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
  display: "auto",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Team United",
  description: "Join Teams make friends and rekindle the kid inside of you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 

  return (
    <html lang="en">
      {/* <head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </head> */}
      <Providers>
        <body className={`${roboto.className || inter.className} bg-bgBlack text-black min-h-screen flex flex-col`}>
          {children}
        </body>
      </Providers>
    </html>
  );
}
