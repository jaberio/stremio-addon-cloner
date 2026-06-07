"use client";
import React, { useState } from "react";
import AddonsDragAndDrop from "./Addons";
import { Loader2, Puzzle } from "lucide-react";
import { fetchAddons } from "../services/api";
import { validateAccount } from "../utils/validation";
import { useAccounts } from "../hooks/useAccounts";
import { formatAddonDataForUI } from "../utils/formatAddons";

export default function AddonSelector() {
    const { primaryAccount, setAlert, setAddons, addons } = useAccounts();
    const [loadingAddon, setLoadingAddon] = useState(false);
    const [showAddons, setShowAddons] = useState(false);

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
            setAddons(formatAddonDataForUI(addonsResult, true));
            setShowAddons(true);
        } catch (err) {
            if (err instanceof Error)
                setAlert({ type: "error", message: `Failed to load addons: ${err.message}` });
        } finally {
            setLoadingAddon(false);
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
                    <Puzzle className="w-5 h-5" />
                )}
                <span>
                    {loadingAddon ? "Loading Addons..." : "Select Addons to Clone (Optional)"}
                </span>
            </button>

            {showAddons && (
                <div className="mt-3 animate-fade-in">
                    <AddonsDragAndDrop
                        addons={addons}
                        onChange={(updatedAddons) => setAddons(updatedAddons)}
                    />
                </div>
            )}
        </div>
    );
}
