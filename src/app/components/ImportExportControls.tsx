"use client";

import { useRef } from "react";
import { Upload, Download } from "lucide-react";
import { useAccounts } from "../hooks/useAccounts";

export default function ImportExportControls() {
    const { primaryAccount, cloneAccounts, setPrimaryAccount, setCloneAccounts, setAlert } = useAccounts();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleExport = () => {
        const dataStr = JSON.stringify({ primary: primaryAccount, clones: cloneAccounts }, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "stremio-addon-cloner-export.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                if (data.primary && data.clones) {
                    setPrimaryAccount(data.primary);
                    setCloneAccounts(data.clones);
                    setAlert({ type: "success", message: "Account details imported successfully!" });
                } else {
                    setAlert({ type: "error", message: "Invalid file format." });
                }
            } catch {
                setAlert({ type: "error", message: "Failed to import JSON file." });
            }
        };
        reader.readAsText(file);

        // Reset so re-importing the same file triggers onChange
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex justify-end items-center gap-3">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-base px-4 py-2 text-sm text-white"
                    style={{
                        background: "var(--color-info)",
                        borderRadius: "var(--radius-md)",
                    }}
                >
                    <Upload size={16} /> Import
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={handleImport}
                />

                <button
                    onClick={handleExport}
                    className="btn-base px-4 py-2 text-sm text-white"
                    style={{
                        background: "var(--color-success)",
                        borderRadius: "var(--radius-md)",
                    }}
                >
                    <Download size={16} /> Export
                </button>
            </div>

            <div className="flex justify-end">
                <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>
                    Note: Only <span className="font-semibold">account details</span> are exported, not addons.
                </p>
            </div>
        </div>
    );
}
