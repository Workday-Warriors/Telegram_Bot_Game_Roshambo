import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DGI Game | Staking Dashboard",
  description: "DGI Staking Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
