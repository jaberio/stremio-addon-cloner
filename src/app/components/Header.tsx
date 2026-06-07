"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqItems = [
    { q: "What does this tool do?", a: "It helps you copy addons from your main Stremio account to other accounts." },
    { q: "Are addon credentials also cloned?", a: "Yes — addon credentials (such as Debrid keys) are copied along with the addons." },
    { q: "Can you overwrite the Debrid key during cloning?", a: "Yes — you can choose to replace it, but only for certain supported addons." },
    { q: "What are the supported addons for override?", a: "Only certain addons support Debrid key overrides. You can see the full list when you enable the override option." },
    { q: "Can you add addons on top of existing ones?", a: "Yes. Clone mode can either sync (match exactly) or append (add without removing existing ones)." },
    { q: "Can you view installed addons for a clone account?", a: "Yes. Click the puzzle icon on the top-right corner of each clone account." },
    { q: "Can I undo a clone?", a: "There's no automatic undo, but you can remove addons by opening the installed addons and clicking the trash icon." },
    { q: "Is it safe?", a: "Yes. The tool only works with your accounts and does not save or share any of your data." },
];

const Header = () => {
    const [showFAQ, setShowFAQ] = useState(false);

    return (
        <header
            className="w-full py-10 md:py-14"
            style={{
                borderBottom: "1px solid var(--border-subtle)",
            }}
        >
            <div className="max-w-5xl mx-auto px-6 text-center">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                    Stremio Addon Cloner
                </h1>
                <p className="mt-3 text-sm md:text-base max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>
                    Clone your Stremio addons from your primary account to multiple accounts — fast and easy.
                </p>

                {/* Info + FAQ */}
                <div
                    className="mt-6 inline-block text-left max-w-xl text-sm"
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-default)",
                        borderRadius: "var(--radius-lg)",
                        padding: "0.875rem 1.25rem",
                        color: "var(--text-secondary)",
                    }}
                >
                    <p>
                        ℹ️ This tool works directly with your Stremio account. Use responsibly.
                    </p>

                    {/* FAQ Accordion */}
                    <div className="mt-3 pt-2" style={{ borderTop: "1px solid var(--border-default)" }}>
                        <button
                            onClick={() => setShowFAQ(!showFAQ)}
                            className="flex items-center text-xs font-medium transition-colors"
                            style={{ color: "var(--accent-primary)" }}
                        >
                            {showFAQ ? "Hide FAQ" : "Show FAQ"}
                            {showFAQ ? <ChevronUp className="ml-1 w-3.5 h-3.5" /> : <ChevronDown className="ml-1 w-3.5 h-3.5" />}
                        </button>

                        <div
                            className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                showFAQ ? "max-h-[600px] opacity-100 mt-3" : "max-h-0 opacity-0"
                            }`}
                        >
                            <div className="space-y-2">
                                {faqItems.map((item, i) => (
                                    <div key={i} className="text-xs" style={{ color: "var(--text-secondary)" }}>
                                        <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{item.q}</span>{" "}
                                        <span style={{ color: "var(--text-muted)" }}>{item.a}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
