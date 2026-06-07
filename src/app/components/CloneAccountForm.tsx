"use client";
import { useState } from "react";
import { Account } from "../types/accounts";
import { Eye, EyeOff, Puzzle, Wrench, X } from "lucide-react";
import { useAccounts } from "../hooks/useAccounts";
import DebridOverrideSection from "./DebridOverrideSection";
import CloneModeToggle from "./CloneModeToggle";
import CloneAccountAddonsModal from "./CloneAccountAddonsModal";

type CloneAccountFormProps = {
    index: number;
    account: Account;
};

export default function CloneAccountForm({ index, account }: CloneAccountFormProps) {
    const { setCloneAccounts, removeAccount } = useAccounts();
    const [showAddonsModal, setShowAddonsModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleCloneChange = (idx: number, field: keyof Account, value: string | boolean) => {
        setCloneAccounts((prev) => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], [field]: value };
            return updated;
        });
    };

    return (
        <div
            className="p-4 animate-fade-in card-interactive"
            style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-lg)",
            }}
        >
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={account.selected ?? false}
                        onChange={(e) => handleCloneChange(index, "selected", e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-[var(--border-default)] bg-[var(--bg-input)]
                            checked:bg-[var(--accent-primary)] checked:border-[var(--accent-primary)]
                            cursor-pointer transition-all"
                    />
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        #{index + 1}
                    </span>
                </label>

                <div className="flex space-x-1">
                    <button
                        type="button"
                        title="Installed Addons"
                        onClick={() => setShowAddonsModal(true)}
                        className="p-1.5 rounded-[var(--radius-sm)] transition-all text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-subtle)]"
                    >
                        <Puzzle className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        title="Debrid Override"
                        onClick={() => handleCloneChange(index, "is_debrid_override", !account.is_debrid_override)}
                        className="p-1.5 rounded-[var(--radius-sm)] transition-all"
                        style={{
                            color: account.is_debrid_override ? "var(--accent-primary)" : "var(--text-muted)",
                            background: account.is_debrid_override ? "var(--accent-subtle)" : "transparent",
                        }}
                    >
                        <Wrench className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        title="Remove"
                        onClick={() => removeAccount(index)}
                        className="p-1.5 rounded-[var(--radius-sm)] transition-all text-[var(--text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)]"
                    >
                        <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex space-x-3 mb-2.5">
                <label className="flex items-center space-x-1.5 cursor-pointer text-xs">
                    <input
                        type="radio"
                        name={`mode-${index}`}
                        value="credentials"
                        checked={account.mode === "credentials"}
                        onChange={() => handleCloneChange(index, "mode", "credentials")}
                        className="accent-[var(--accent-primary)] w-3 h-3"
                    />
                    <span style={{ color: "var(--text-secondary)" }}>Email/Password</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer text-xs">
                    <input
                        type="radio"
                        name={`mode-${index}`}
                        value="authkey"
                        checked={account.mode === "authkey"}
                        onChange={() => handleCloneChange(index, "mode", "authkey")}
                        className="accent-[var(--accent-primary)] w-3 h-3"
                    />
                    <span style={{ color: "var(--text-secondary)" }}>AuthKey</span>
                </label>
            </div>

            {/* Inputs */}
            {account.mode === "credentials" ? (
                <div className="space-y-2">
                    <input
                        type="email"
                        placeholder="Email"
                        className="glass-input w-full px-3 py-2 rounded-[var(--radius-md)] text-sm"
                        value={account.email}
                        onChange={(e) => handleCloneChange(index, "email", e.target.value)}
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="glass-input w-full px-3 py-2 pr-9 rounded-[var(--radius-md)] text-sm"
                            value={account.password}
                            onChange={(e) => handleCloneChange(index, "password", e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>
            ) : (
                <input
                    type="password"
                    placeholder="AuthKey"
                    className="glass-input w-full px-3 py-2 rounded-[var(--radius-md)] text-sm"
                    value={account.authkey}
                    onChange={(e) => handleCloneChange(index, "authkey", e.target.value)}
                />
            )}

            {/* Debrid Override */}
            {account.is_debrid_override && (
                <DebridOverrideSection account={account} index={index} onChange={handleCloneChange} />
            )}

            {/* Clone Mode */}
            <CloneModeToggle account={account} index={index} onChange={handleCloneChange} />

            {/* Addons Modal */}
            <CloneAccountAddonsModal
                account={account}
                index={index}
                isOpen={showAddonsModal}
                onClose={() => setShowAddonsModal(false)}
            />
        </div>
    );
}
