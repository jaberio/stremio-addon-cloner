"use client";
import React, { useState } from "react";
import { Addon, AddonData } from "../types/addon";
import { Loader2, Cog, Plus, X } from "lucide-react";
import { fetchAddons, updateAddons } from "../services/api";
import { validateAccount } from "../utils/validation";
import { useAccounts } from "../hooks/useAccounts";
import AddonsDragAndDropNoCheck from "./PrimaryAddons";
import { formatAddonDataForUI } from "../utils/formatAddons";

export default function ConfigurePrimary() {
    const { primaryAccount, setAlert } = useAccounts();
    const [localAddons, setLocalAddons] = useState<Addon[]>([]);
    const [loadingAddon, setLoadingAddon] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showAddons, setShowAddons] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [manifestUrl, setManifestUrl] = useState("");
    const [adding, setAdding] = useState(false);

    const handleSaveConfig = async () => {
        setSaving(true);
        try {
            await updateAddons(
                primaryAccount,
                localAddons.map((addon) => addon.addon)
            );
            setShowAddons(false);
            setAlert({ type: "success", message: "Addon configuration saved!" });
        } catch (err) {
            if (err instanceof Error) {
                setAlert({ type: "error", message: `Failed to update addons: ${err.message}` });
            }
        } finally {
            setSaving(false);
        }
    };

    const handleAddAddon = () => {
        setManifestUrl("");
        setShowModal(true);
    };

    const handleCancelConfig = () => {
        if (saving) return;
        setLocalAddons([]);
        setShowAddons(false);
    };

    const handleSelectAddonsClick = async () => {
        setLoadingAddon(true);
        setAlert(null);
        try {
            const { valid, error } = validateAccount(primaryAccount, "Primary");
            if (!valid) {
                setAlert({ type: "error", message: error! });
                return;
            }

            const addonsResult = await fetchAddons(primaryAccount);
            setLocalAddons(formatAddonDataForUI(addonsResult));
            setShowAddons(true);
        } catch (err) {
            if (err instanceof Error) {
                setAlert({ type: "error", message: `Failed to load addons: ${err.message}` });
            }
        } finally {
            setLoadingAddon(false);
        }
    };

    const handleConfirmAddAddon = async () => {
        if (!manifestUrl.trim()) return;

        setAdding(true);
        try {
            const res = await fetch(manifestUrl);
            if (!res.ok) throw new Error("Failed to fetch manifest");
            const manifest = await res.json();

            const newAddon: Addon = {
                addon: {
                    transportUrl: manifestUrl,
                    manifest,
                    flags: { protected: false },
                } as AddonData,
                id: manifestUrl,
                name: manifest.name || "Unknown Addon",
                is_protected: false,
                is_configurable: manifest?.behaviorHints?.configurable ?? false,
                checked: true,
                uuid: crypto.randomUUID(),
            };

            setLocalAddons((prev) => [...prev, newAddon]);
            setShowModal(false);
        } catch (err) {
            if (err instanceof Error) {
                setAlert({ type: "error", message: `Failed to add addon: ${err.message}` });
            }
        } finally {
            setAdding(false);
        }
    };

    return (
        <div>
            <button
                type="button"
                onClick={handleSelectAddonsClick}
                disabled={loadingAddon}
                className="mt-4 flex items-center justify-center w-full gap-2 py-3 transition-all"
                style={{
                    borderRadius: "var(--radius-md)",
                    border: "1px dashed var(--border-default)",
                    background: "var(--bg-elevated)",
                    color: "var(--text-muted)",
                }}
            >
                {loadingAddon ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Cog className="w-5 h-5" />
                )}
                <span>{loadingAddon ? "Loading Addons..." : "Configure (Optional)"}</span>
            </button>

            {showAddons && (
                <div className="mt-4 space-y-4 animate-fade-in">
                    <AddonsDragAndDropNoCheck
                        addons={localAddons}
                        onChange={(updatedAddons) => setLocalAddons(updatedAddons)}
                    />

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 w-full">
                        <button
                            type="button"
                            onClick={handleAddAddon}
                            className="btn-base btn-success px-6 py-2 w-full sm:w-auto"
                        >
                            <Plus className="w-4 h-4" />
                            Add Addon
                        </button>

                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={handleCancelConfig}
                                disabled={saving}
                                className="btn-base btn-ghost px-6 py-2 w-full sm:w-auto"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSaveConfig}
                                disabled={saving}
                                className="btn-base btn-primary px-6 py-2 w-full sm:w-auto"
                            >
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Addon Modal */}
            {showModal && (
                <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="modal-card p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                                Add Addon
                            </h2>
                            <button onClick={() => setShowModal(false)} className="transition-colors" style={{ color: "var(--text-muted)" }}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={manifestUrl}
                            onChange={(e) => setManifestUrl(e.target.value)}
                            placeholder="Enter manifest URL"
                            className="glass-input w-full px-3 py-2.5 rounded-[var(--radius-md)]"
                            onKeyDown={(e) => e.key === "Enter" && handleConfirmAddAddon()}
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="btn-base btn-ghost px-4 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmAddAddon}
                                disabled={adding}
                                className="btn-base btn-success px-4 py-2"
                            >
                                {adding && <Loader2 className="w-4 h-4 animate-spin" />}
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
