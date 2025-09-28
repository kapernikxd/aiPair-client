import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/stores/StoreProvider";
import AuthPromptManager from "@/components/AuthPromptManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Pair | Free AI Character Chat",
  description: "Chat with AI characters for free! Create personalized connections, have conversations that feel real, and discover your perfect AI friends. Create Your Super Intelligent World with AI Pair!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          <AuthPromptManager />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
