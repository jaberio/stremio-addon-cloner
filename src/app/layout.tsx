import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AccountsProvider } from "./hooks/useAccounts";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Stremio Addon Cloner",
    description: "Clone your Stremio addons from your primary account to multiple accounts — fast and easy.",
    icons: {
        icon: "/logo.png",
    },
    manifest: "/manifest.webmanifest",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                style={{
                    background: "var(--bg-page)",
                    color: "var(--text-primary)",
                }}
            >
                <ServiceWorkerRegister />
                <AccountsProvider>{children}</AccountsProvider>
            </body>
        </html>
    );
}
