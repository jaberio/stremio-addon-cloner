"use client";
import { useEffect, useState } from "react";
import { Addon } from "../types/addon";
import AddonEditModal from "./AddonEditModal";
import SortableAddonList from "./SortableAddonList";

type Props = {
    addons: Addon[];
    onChange: (newAddons: Addon[]) => void;
};

/**
 * Addon list with delete + edit — used by ConfigurePrimary for managing primary account addons.
 * Thin wrapper around the unified SortableAddonList, adding delete confirmation + edit modal.
 */
export default function AddonsDragAndDropNoCheck({ addons, onChange }: Props) {
    const [addonToDelete, setAddonToDelete] = useState<string | null>(null);
    const [addonToEdit, setAddonToEdit] = useState<Addon | null>(null);

    useEffect(() => {
        document.body.style.overflow = addonToDelete || addonToEdit ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [addonToDelete, addonToEdit]);

    const handleDelete = (uuid: string) => {
        onChange(addons.filter((addon) => addon.uuid !== uuid));
    };

    return (
        <div className="space-y-3">
            <SortableAddonList
                addons={addons}
                onChange={onChange}
                showCheckboxes={false}
                showDelete={true}
                showEdit={true}
                onRequestDelete={(uuid) => setAddonToDelete(uuid)}
                onRequestEdit={(addon) => setAddonToEdit(addon)}
            />

            {/* Delete Confirmation Modal */}
            {addonToDelete && (
                <div className="modal-backdrop" onClick={() => setAddonToDelete(null)}>
                    <div className="modal-card p-6 w-80 animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Confirm Deletion</h2>
                        <p className="mb-6 text-sm text-[var(--text-secondary)]">
                            Are you sure you want to delete this addon?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setAddonToDelete(null)}
                                className="btn-base btn-ghost px-4 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(addonToDelete);
                                    setAddonToDelete(null);
                                }}
                                className="btn-base btn-danger px-4 py-2"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AddonEditModal
                addonToEdit={addonToEdit}
                addons={addons}
                onChange={onChange}
                onClose={() => setAddonToEdit(null)}
            />
        </div>
    );
}
