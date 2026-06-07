"use client";
import React, { useState, useCallback } from "react";
import { Copy, Loader2 } from "lucide-react";
import { useAccounts } from "../hooks/useAccounts";
import { validateAccount, validateCloneAccounts } from "../utils/validation";
import { cloneAddons } from "../services/api";

export default function CloneControls() {
    const {
        cloneAccounts,
        primaryAccount,
        setRememberDetails,
        rememberDetails,
        setAlert,
        addons,
    } = useAccounts();
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(async () => {
        const { valid, error } = validateAccount(primaryAccount, "Primary");
        if (!valid) {
            setAlert({ type: "error", message: error! });
            return;
        }

        const cloneValidation = validateCloneAccounts(cloneAccounts);
        if (!cloneValidation.valid) {
            setAlert({ type: "error", message: cloneValidation.error! });
            return;
        }

        setLoading(true);
        setAlert(null);

        try {
            const addonsToClone = addons
                .filter((addon) => addon.checked)
                .map((addon) => addon.addon);

            await cloneAddons(
                primaryAccount,
                cloneAccounts.filter((account) => account.selected),
                addonsToClone
            );
            setAlert({ type: "success", message: "Addons cloned successfully!" });
        } catch (err) {
            if (err instanceof Error) {
                setAlert({ type: "error", message: err.message });
            }
        } finally {
            setLoading(false);
        }
    }, [primaryAccount, cloneAccounts, addons, setAlert]);

    const selectedCount = cloneAccounts.filter((a) => a.selected).length;

    return (
        <div>
            {/* Stats */}
            {!loading && (
                <div className="mb-2 text-sm text-center" style={{ color: "var(--text-muted)" }}>
                    {selectedCount} of {cloneAccounts.length} accounts selected
                </div>
            )}

            {/* Clone Button */}
            <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || selectedCount === 0}
                className="btn-base w-full py-3 font-medium text-white transition-all"
                style={{
                    background: loading || selectedCount === 0
                        ? "var(--bg-elevated)"
                        : "var(--gradient-success)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: loading || selectedCount === 0
                        ? "none"
                        : "0 0 20px var(--color-success-glow)",
                    cursor: loading || selectedCount === 0 ? "not-allowed" : "pointer",
                    opacity: loading || selectedCount === 0 ? 0.5 : 1,
                }}
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Copy className="w-5 h-5" />
                )}
                {loading ? "Cloning..." : "Clone Addons"}
            </button>

            {/* Remember Details */}
            <label className="flex items-center gap-2.5 mt-4 cursor-pointer select-none">
                <input
                    type="checkbox"
                    checked={rememberDetails}
                    onChange={(e) => setRememberDetails(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-[var(--border-default)] bg-[var(--bg-input)]
                        checked:bg-[var(--accent-primary)] checked:border-[var(--accent-primary)]
                        focus:ring-2 focus:ring-[var(--accent-glow)] cursor-pointer transition-all"
                />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Remember my details
                </span>
            </label>
        </div>
    );
}
