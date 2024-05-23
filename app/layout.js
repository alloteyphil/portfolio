import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Philip | Portfolio",
  description: "Portfolio showcasing Philip Allotey's work and projects.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth text-neutral-50">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
