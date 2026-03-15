import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mainstance",
  description: "Internal work-order and accountability platform for operations teams."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
