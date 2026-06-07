"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Addon } from "../types/addon";
import { Pencil, Loader2 } from "lucide-react";

interface AddonEditModalProps {
    addonToEdit: Addon | null;
    addons: Addon[];
    onChange: (updated: Addon[]) => void;
    onClose: () => void;
}

export default function AddonEditModal({
    addonToEdit,
    addons,
    onChange,
    onClose,
}: AddonEditModalProps) {
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState(addonToEdit?.name || "");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (addonToEdit) {
            setDisplayName(addonToEdit.name);
            setIsEditing(false);
        }
    }, [addonToEdit]);

    // Escape key handler
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) onClose();
        },
        [loading, onClose]
    );

    useEffect(() => {
        if (addonToEdit) {
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }
    }, [addonToEdit, handleKeyDown]);

    if (!addonToEdit) return null;

    const isDisabled =
        addonToEdit.name.startsWith("[DISABLED]") ||
        addonToEdit.addon.manifest?.name?.startsWith("[DISABLED]");

    const handleRename = (newName: string) => {
        const updated = addons.map((a) =>
            a.uuid === addonToEdit.uuid
                ? {
                    ...a,
                    name: newName,
                    addon: {
                        ...a.addon,
                        manifest: { ...a.addon.manifest, name: newName },
                    },
                }
                : a
        );
        onChange(updated);
        setDisplayName(newName);
        setIsEditing(false);
    };

    const handleDisable = () => {
        const updated = addons.map((a) =>
            a.uuid === addonToEdit.uuid
                ? {
                    ...a,
                    name: a.name.startsWith("[DISABLED]") ? a.name : `[DISABLED] ${a.name}`,
                    addon: {
                        ...a.addon,
                        manifest: {
                            ...a.addon.manifest,
                            name: a.addon.manifest.name.startsWith("[DISABLED]")
                                ? a.addon.manifest.name
                                : `[DISABLED] ${a.addon.manifest.name}`,
                            types: [],
                            catalogs: [],
                            resources: [],
                        },
                    },
                }
                : a
        );
        onChange(updated);
        onClose();
    };

    const handleEnable = async () => {
        const transportUrl = addonToEdit.addon.transportUrl;
        setLoading(true);

        try {
            const response = await fetch(transportUrl);
            if (!response.ok) throw new Error("Failed to fetch manifest");
            const freshManifest = await response.json();

            const updated = addons.map((a) =>
                a.uuid === addonToEdit.uuid
                    ? {
                        ...a,
                        name: a.name.replace(/^\[DISABLED\]\s*/, ""),
                        addon: {
                            ...a.addon,
                            manifest: {
                                ...freshManifest,
                                name: a.addon.manifest.name.replace(/^\[DISABLED\]\s*/, ""),
                            },
                        },
                    }
                    : a
            );

            onChange(updated);
            setDisplayName(addonToEdit.name.replace(/^\[DISABLED\]\s*/, ""));
        } catch (err) {
            console.error("Error enabling addon:", err);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={() => !loading && onClose()}>
            <div className="modal-card p-6 w-96" onClick={(e) => e.stopPropagation()}>
                {/* Header — name + edit */}
                <div className="flex items-center justify-between mb-2">
                    {isEditing ? (
                        <div className="flex items-center w-full gap-2">
                            <input
                                ref={inputRef}
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleRename(displayName);
                                    if (e.key === "Escape") setIsEditing(false);
                                }}
                                autoFocus
                                className="glass-input flex-1 px-2 py-1.5 rounded-[var(--radius-sm)] text-sm"
                            />
                            <button
                                onClick={() => handleRename(displayName)}
                                className="btn-base btn-primary px-3 py-1.5 text-sm"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                                {displayName}
                            </h2>
                            <button
                                onClick={() => {
                                    setIsEditing(true);
                                    setTimeout(() => inputRef.current?.focus(), 0);
                                }}
                                className="ml-2 p-1.5 rounded-[var(--radius-sm)] transition-colors"
                                style={{ color: "var(--text-muted)" }}
                                aria-label="Edit name"
                            >
                                <Pencil size={15} />
                            </button>
                        </>
                    )}
                </div>

                <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
                    Toggle this addon&apos;s status:
                </p>

                {addonToEdit.name.toLowerCase() === "cinemeta" && (
                    <p className="mb-4 text-xs" style={{ color: "var(--color-danger)" }}>
                        ⚠️ Disabling <b>cinemeta</b> may break your Stremio account.
                    </p>
                )}

                <div className="flex gap-3">
                    {!isDisabled && (
                        <button
                            onClick={handleDisable}
                            disabled={loading}
                            className="btn-base btn-ghost flex-1 py-2"
                            style={{ color: "var(--color-warning)" }}
                        >
                            Disable
                        </button>
                    )}

                    {isDisabled && (
                        <button
                            onClick={handleEnable}
                            disabled={loading}
                            className="btn-base btn-ghost flex-1 py-2"
                            style={{ color: "var(--color-success)" }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Enabling...
                                </>
                            ) : (
                                "Enable"
                            )}
                        </button>
                    )}
                </div>

                <div className="mt-5 flex justify-end">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="btn-base btn-ghost px-4 py-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
