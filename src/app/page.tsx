"use client";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Alert from "./components/Alert";
import PrimaryAccountForm from "./components/PrimaryAccountForm";
import CloneAccountList from "./components/CloneAccountList";
import CloneControls from "./components/CloneControls";
import { useAccounts } from "./hooks/useAccounts";
import ImportExportControls from "./components/ImportExportControls";
import TargetAccountsSeparator from "./components/TargetAccountsSeparator";

export default function Home() {
    const { alert, setAlert } = useAccounts();

    return (
        <main className="min-h-screen flex flex-col items-center relative overflow-hidden">
            {/* NVIDIA-style ambient gradient overlays */}
            <div
                className="fixed inset-0 pointer-events-none -z-10"
                style={{
                    background: `
                        radial-gradient(ellipse 60% 40% at 20% 0%, rgba(118, 185, 71, 0.06) 0%, transparent 60%),
                        radial-gradient(ellipse 50% 30% at 80% 10%, rgba(120, 200, 255, 0.03) 0%, transparent 50%),
                        radial-gradient(ellipse 40% 20% at 50% 100%, rgba(118, 185, 71, 0.03) 0%, transparent 50%),
                        var(--bg-page)
                    `,
                }}
            />

            <Header />

            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            <div
                className="w-full max-w-5xl mx-auto px-4 md:px-6 mt-6 mb-10 space-y-6 animate-fade-in"
            >
                {/* Primary Account Section */}
                <section
                    className="p-5 md:p-6"
                    style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-xl)",
                        backdropFilter: "blur(20px)",
                    }}
                >
                    <PrimaryAccountForm />
                </section>

                <TargetAccountsSeparator />

                {/* Clone Accounts Section */}
                <section
                    className="p-5 md:p-6"
                    style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-xl)",
                        backdropFilter: "blur(20px)",
                    }}
                >
                    <CloneAccountList />
                </section>

                {/* Actions Section */}
                <section
                    className="p-5 md:p-6"
                    style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-xl)",
                        backdropFilter: "blur(20px)",
                    }}
                >
                    <CloneControls />
                    <div className="mt-5 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                        <ImportExportControls />
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
