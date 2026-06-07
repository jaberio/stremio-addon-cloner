"use client";

import { useState } from "react";
import { useAccounts } from "../hooks/useAccounts";
import { Account } from "../types/accounts";
import ConfigurePrimary from "./ConfigurePrimary";
import { Eye, EyeOff } from "lucide-react";

export default function PrimaryAccountForm() {
    const { primaryAccount, setPrimaryAccount } = useAccounts();

    const handlePrimaryChange = <K extends keyof Account>(field: K, value: Account[K]) => {
        setPrimaryAccount((prev) => ({ ...prev, [field]: value }));
    };

    const [showTooltip, setShowTooltip] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showAuthKey, setShowAuthKey] = useState(false);

    return (
        <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                Primary Account
            </h2>

            {/* Mode Toggle */}
            <div className="flex space-x-4 mb-4">
                <label className="flex items-center space-x-2 cursor-pointer text-sm">
                    <input
                        type="radio"
                        name="primaryMode"
                        value="credentials"
                        checked={primaryAccount.mode === "credentials"}
                        onChange={() => handlePrimaryChange("mode", "credentials")}
                        className="accent-[var(--accent-primary)]"
                    />
                    <span style={{ color: "var(--text-secondary)" }}>Email/Password</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer text-sm">
                    <input
                        type="radio"
                        name="primaryMode"
                        value="authkey"
                        checked={primaryAccount.mode === "authkey"}
                        onChange={() => handlePrimaryChange("mode", "authkey")}
                        className="accent-[var(--accent-primary)]"
                    />
                    <span className="flex items-center" style={{ color: "var(--text-secondary)" }}>
                        AuthKey
                        <div className="relative ml-2">
                            <button
                                type="button"
                                className="w-5 h-5 text-xs flex items-center justify-center rounded-full font-bold transition-all"
                                style={{
                                    color: "var(--accent-primary)",
                                    border: "1.5px solid var(--accent-primary)",
                                }}
                                onClick={() => setShowTooltip((prev) => !prev)}
                            >
                                ?
                            </button>
                            {showTooltip && (
                                <div
                                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-sm p-3 w-72 z-10 animate-fade-in"
                                    style={{
                                        background: "var(--bg-surface-solid)",
                                        border: "1px solid var(--border-default)",
                                        borderRadius: "var(--radius-lg)",
                                        boxShadow: "var(--shadow-modal)",
                                        backdropFilter: "blur(16px)",
                                    }}
                                >
                                    <strong style={{ color: "var(--accent-primary)" }}>How to get your AuthKey:</strong>
                                    <ol className="list-decimal list-inside mt-1.5 space-y-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                                        <li>
                                            Log in to{" "}
                                            <a
                                                href="https://web.stremio.com/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline"
                                                style={{ color: "var(--accent-primary)" }}
                                            >
                                                web.stremio.com
                                            </a>
                                        </li>
                                        <li>Open the browser console (F12 or Ctrl+Shift+I)</li>
                                        <li>
                                            Run:{" "}
                                            <code
                                                className="px-1 py-0.5 rounded text-xs break-all"
                                                style={{
                                                    background: "var(--bg-input)",
                                                    border: "1px solid var(--border-default)",
                                                    color: "var(--color-success)",
                                                }}
                                            >
                                                JSON.parse(localStorage.getItem(&quot;profile&quot;)).auth.key
                                            </code>
                                        </li>
                                        <li>Copy the output and paste it here</li>
                                    </ol>
                                    <div
                                        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                                        style={{
                                            background: "var(--bg-surface-solid)",
                                            borderLeft: "1px solid var(--border-default)",
                                            borderTop: "1px solid var(--border-default)",
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </span>
                </label>
            </div>

            {/* Credential Inputs */}
            {primaryAccount.mode === "credentials" ? (
                <div className="space-y-3">
                    <input
                        type="email"
                        placeholder="Email"
                        className="glass-input w-full px-3 py-2.5 rounded-[var(--radius-md)]"
                        value={primaryAccount.email}
                        onChange={(e) => handlePrimaryChange("email", e.target.value)}
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="glass-input w-full px-3 py-2.5 pr-10 rounded-[var(--radius-md)]"
                            value={primaryAccount.password}
                            onChange={(e) => handlePrimaryChange("password", e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
                            style={{ color: "var(--text-muted)" }}
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative">
                    <input
                        type={showAuthKey ? "text" : "password"}
                        placeholder="AuthKey"
                        className="glass-input w-full px-3 py-2.5 pr-10 rounded-[var(--radius-md)]"
                        value={primaryAccount.authkey}
                        onChange={(e) => handlePrimaryChange("authkey", e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowAuthKey((prev) => !prev)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
                        style={{ color: "var(--text-muted)" }}
                        title={showAuthKey ? "Hide AuthKey" : "Show AuthKey"}
                    >
                        {showAuthKey ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                </div>
            )}

            <ConfigurePrimary />
        </section>
    );
}
