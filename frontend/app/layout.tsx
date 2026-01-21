import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Rishihood Sports Fest 2026 | Inter-College Sports Festival",
  description: "Experience the thrill of competition. Join thousands of athletes from across India in the biggest inter-college sports festival at Rishihood University.",
  keywords: ["sports fest", "rishihood", "inter-college", "sports", "tournament", "2026"],
  authors: [{ name: "Rishihood University" }],
  openGraph: {
    title: "Rishihood Sports Fest 2026",
    description: "The biggest inter-college sports festival",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
