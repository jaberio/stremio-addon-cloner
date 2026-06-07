"use client";
import { useState, useEffect } from "react";
import { Copy, ExternalLink, Loader2, Trash2, X } from "lucide-react";
import { Account } from "../types/accounts";
import { AddonData } from "../types/addon";
import { fetchAddons, updateAddons } from "../services/api";
import { validateAccount } from "../utils/validation";
import Alert from "./Alert";

type CloneAccountAddonsModalProps = {
    account: Account;
    index: number;
    isOpen: boolean;
    onClose: () => void;
};

export default function CloneAccountAddonsModal({
    account,
    index,
    isOpen,
    onClose,
}: CloneAccountAddonsModalProps) {
    const [addons, setAddons] = useState<AddonData[]>([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadAddons();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const loadAddons = async () => {
        try {
            const { valid, error } = validateAccount(account, "Clone");
            if (!valid) {
                setAlert({ type: "error", message: error! });
                return;
            }
            setLoading(true);
            const res = await fetchAddons(account);
            setAddons(res);
        } catch (err) {
            if (err instanceof Error)
                setAlert({ type: "error", message: `Failed to load addons: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddon = async (addonIndex: number) => {
        try {
            const remaining = addons.filter((_, i) => i !== addonIndex);
            setLoading(true);
            const updated = await updateAddons(account, remaining);
            if (updated.success) {
                setAddons(updated.addons);
            }
        } catch (err) {
            if (err instanceof Error) {
                setAlert({ type: "error", message: `Failed to update addons: ${err.message}` });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAllAddons = async () => {
        try {
            const remaining = addons.filter((addon) => addon.flags.protected);
            setLoading(true);
            const updated = await updateAddons(account, remaining);
            if (updated.success) {
                setAddons(updated.addons);
            }
        } catch (err) {
            if (err instanceof Error) {
                setAlert({ type: "error", message: `Failed to update addons: ${err.message}` });
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal-card w-full max-w-md p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                <button
                    className="absolute top-3 right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    onClick={onClose}
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
                    Account #{index + 1} — Installed Addons
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-[var(--text-muted)]" />
                    </div>
                ) : addons.length > 0 ? (
                    <div>
                        <div className="max-h-80 overflow-y-auto pr-1 space-y-1.5">
                            {addons.map((addon, i) => {
                                const isConfigurable = addon.manifest.behaviorHints?.configurable ?? false;
                                const isProtected = addon.flags.protected ?? false;

                                return (
                                    <div
                                        key={`${i}-${addon.transportUrl}`}
                                        className="flex items-center justify-between p-2.5 rounded-[var(--radius-md)] glass-strong"
                                    >
                                        <span className="text-sm text-[var(--text-secondary)] truncate mr-2">
                                            {addon.manifest.name}
                                            {isProtected && <span className="text-[var(--text-muted)] ml-1">(Protected)</span>}
                                        </span>
                                        <div className="flex space-x-1 shrink-0">
                                            <a
                                                href={isConfigurable ? addon.transportUrl.replace("/manifest.json", "/configure") : undefined}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`p-1.5 rounded-[var(--radius-sm)] transition-all ${
                                                    !isConfigurable
                                                        ? "text-[var(--text-muted)] opacity-40 cursor-not-allowed"
                                                        : "text-[var(--accent-primary)] hover:bg-[var(--accent-subtle)]"
                                                }`}
                                                onClick={(e) => { if (!isConfigurable) e.preventDefault(); }}
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(addon.transportUrl)}
                                                className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)] transition-all"
                                                title="Copy Addon URL"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={!isProtected ? () => handleDeleteAddon(i) : undefined}
                                                disabled={isProtected}
                                                className={`p-1.5 rounded-[var(--radius-sm)] transition-all ${
                                                    isProtected
                                                        ? "text-[var(--text-muted)] opacity-40 cursor-not-allowed"
                                                        : "text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)]"
                                                }`}
                                                title={isProtected ? "Protected addon" : "Delete Addon"}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {addons.length > 1 && (
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleDeleteAllAddons}
                                    className="btn-base btn-danger px-3 py-2 text-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete All (Protected excluded)</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-[var(--text-muted)] text-sm py-4">No addons found.</p>
                )}
            </div>
        </div>
    );
}
