"use client";
import { ExternalLink, Key, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Account } from "../types/accounts";
import { DEBRID_OPTIONS, SUPPORTED_ADDONS_DEBRID_OVERRIDE } from "../utils/debridOptions";

type DebridOverrideSectionProps = {
    account: Account;
    index: number;
    onChange: (index: number, field: keyof Account, value: string | boolean) => void;
};

export default function DebridOverrideSection({ account, index, onChange }: DebridOverrideSectionProps) {
    const [showSupportedModal, setShowSupportedModal] = useState(false);

    useEffect(() => {
        document.body.style.overflow = showSupportedModal ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [showSupportedModal]);

    return (
        <div className="mt-4 space-y-3 animate-fade-in">
            {/* Warning text */}
            <p className="text-sm" style={{ color: "var(--color-warning)" }}>
                <strong>⚠️ Warning!</strong> This will <strong>replace the debrid key</strong> used by these{" "}
                <button
                    type="button"
                    onClick={() => setShowSupportedModal(true)}
                    className="underline hover:opacity-80 transition-opacity"
                    style={{ color: "var(--accent-primary)" }}
                >
                    addons
                </button>. This may affect how they work.
            </p>

            <div className="flex flex-wrap items-center gap-2">
                {/* Debrid Select */}
                <select
                    value={account.debrid_type || ""}
                    onChange={(e) => onChange(index, "debrid_type", e.target.value)}
                    className="glass-input px-3 py-2 rounded-[var(--radius-md)] w-40 cursor-pointer"
                >
                    {DEBRID_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Key Input + Get Key Button */}
                {account.debrid_type && (
                    <div className="flex items-center flex-1 gap-2 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Enter API key"
                            className="glass-input flex-1 px-3 py-2 rounded-[var(--radius-md)]"
                            value={account.debrid_key || ""}
                            onChange={(e) => onChange(index, "debrid_key", e.target.value)}
                        />
                        <a
                            href={
                                DEBRID_OPTIONS.find((o) => o.value === account.debrid_type)?.url || "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-base btn-ghost p-2 rounded-[var(--radius-md)]"
                            title="Get API Key"
                        >
                            <Key className="w-4.5 h-4.5" style={{ color: "var(--accent-primary)" }} />
                        </a>
                    </div>
                )}
            </div>

            {/* Torbox referral link */}
            {account.debrid_type === "torbox" && (
                <a
                    href="https://torbox.app/subscription?referral=916cba88-0186-4577-b449-0a5d7f820185"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline flex items-center gap-1 hover:opacity-80 transition-opacity"
                    style={{ color: "var(--accent-primary)" }}
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Support me by using my Torbox referral link
                </a>
            )}

            {/* Supported Addons Modal */}
            {showSupportedModal && (
                <div className="modal-backdrop" onClick={() => setShowSupportedModal(false)}>
                    <div
                        className="modal-card w-full max-w-md p-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-3 right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                            onClick={() => setShowSupportedModal(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
                            Addons Compatible with Debrid Override
                        </h2>

                        <ul className="list-disc list-inside space-y-1.5 text-[var(--text-secondary)]">
                            {SUPPORTED_ADDONS_DEBRID_OVERRIDE.map((addon) => (
                                <li key={addon} className="capitalize">{addon}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
