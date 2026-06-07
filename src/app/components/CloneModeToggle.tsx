"use client";
import { HelpCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { Account } from "../types/accounts";

type CloneModeToggleProps = {
    account: Account;
    index: number;
    onChange: (index: number, field: keyof Account, value: string | boolean) => void;
};

export default function CloneModeToggle({ account, index, onChange }: CloneModeToggleProps) {
    return (
        <div
            className="flex items-center space-x-2.5 mt-3 px-2.5 py-1.5 rounded-[var(--radius-md)]"
            style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)" }}
        >
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Mode</span>

            <button
                type="button"
                title={`Clone Mode: ${account.clone_mode === "sync" ? "Sync" : "Append"}`}
                onClick={() =>
                    onChange(index, "clone_mode", account.clone_mode === "sync" ? "append" : "sync")
                }
                className="btn-base btn-ghost px-2 py-1 text-xs"
            >
                {account.clone_mode === "sync" ? (
                    <>
                        <ToggleLeft className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
                        Sync
                    </>
                ) : (
                    <>
                        <ToggleRight className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
                        Append
                    </>
                )}
            </button>

            {account.clone_mode === "append" && (
                <div className="relative group">
                    <HelpCircle className="w-3 h-3 cursor-pointer" style={{ color: "var(--accent-primary)" }} />
                    <div
                        className="absolute left-0 mt-2 w-56 p-2.5 rounded-[var(--radius-md)] z-10 space-y-1.5
                            opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
                            transition-all duration-300 pointer-events-none group-hover:pointer-events-auto text-[10px]"
                        style={{
                            background: "var(--bg-surface-solid)",
                            border: "1px solid var(--border-default)",
                            boxShadow: "var(--shadow-modal)",
                            color: "var(--text-secondary)",
                        }}
                    >
                        <p>Add addons on top of existing ones.</p>
                        <p style={{ color: "var(--color-danger)" }} className="font-semibold">
                            ⚠ If duplicates exist, they will be created again.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
