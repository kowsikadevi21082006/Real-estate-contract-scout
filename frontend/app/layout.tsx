import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Contract Scout | AI Real Estate Analysis",
  description: "Analyze and compare your real estate contracts with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            {children}
          </div>
          <footer className="py-8 bg-white border-t border-gray-100 mt-12">
            <div className="max-w-4xl mx-auto px-8 text-center">
              <p className="text-gray-400 text-sm">
                Real Estate Contract Scout &copy; {new Date().getFullYear()}
              </p>
              <p className="text-gray-600 font-medium mt-1">
                Created with ❤️ by <span className="text-blue-600 font-bold underline decoration-blue-200 decoration-2 underline-offset-4 pointer-events-none">Kowsika</span>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
