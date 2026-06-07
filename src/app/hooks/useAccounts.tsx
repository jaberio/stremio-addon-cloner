"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Account } from "../types/accounts";
import { Addon } from "../types/addon";
import { createDefaultAccount } from "../utils/createDefaultAccount";

type AlertState = { type: "success" | "error"; message: string } | null;

type AccountsContextType = {
    primaryAccount: Account;
    setPrimaryAccount: React.Dispatch<React.SetStateAction<Account>>;
    cloneAccounts: Account[];
    setCloneAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
    rememberDetails: boolean;
    setRememberDetails: (value: boolean) => void;
    addAccount: () => void;
    removeAccount: (index: number) => void;
    addons: Addon[];
    setAddons: (addons: Addon[]) => void;
    alert: AlertState;
    setAlert: React.Dispatch<React.SetStateAction<AlertState>>;
};

const STORAGE_KEY = "stremio_accounts_v1";
const LEGACY_STORAGE_KEY = "stremio_acounts_v1"; // old typo key — migrate from this

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export const AccountsProvider = ({ children }: { children: React.ReactNode }) => {
    const [primaryAccount, setPrimaryAccount] = useState<Account>(() => createDefaultAccount());
    const [cloneAccounts, setCloneAccounts] = useState<Account[]>([
        createDefaultAccount({ selected: true }),
    ]);
    const [rememberDetails, setRememberDetailsState] = useState(false);
    const [addons, setAddons] = useState<Addon[]>([]);
    const [alert, setAlert] = useState<AlertState>(null);

    // Load from localStorage on mount (with migration from old key)
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const decodedPrimary = atob(parsed.primary);
                const decodedClones = atob(parsed.clones);
                const primary = JSON.parse(decodedPrimary);
                const clones = JSON.parse(decodedClones);

                // Ensure accounts have IDs (migration for old data)
                if (!primary.id) primary.id = crypto.randomUUID?.() || Date.now().toString();
                const migratedClones = clones.map((c: Account) => ({
                    ...c,
                    id: c.id || crypto.randomUUID?.() || Date.now().toString() + Math.random(),
                }));

                setPrimaryAccount(primary);
                setCloneAccounts(migratedClones);
                setRememberDetailsState(true);

                // Migrate: save under new key, remove old key
                if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
                    localStorage.removeItem(LEGACY_STORAGE_KEY);
                    localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify({ primary: parsed.primary, clones: parsed.clones })
                    );
                }
            } catch (err) {
                console.error("Failed to load saved accounts:", err);
            }
        }
    }, []);

    // Save/clear localStorage when rememberDetails changes
    const saveToLocalStorage = useCallback(
        (primary: Account, clones: Account[]) => {
            const encodedPrimary = btoa(JSON.stringify(primary));
            const encodedClones = btoa(JSON.stringify(clones));
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ primary: encodedPrimary, clones: encodedClones })
            );
        },
        []
    );

    const setRememberDetails = useCallback(
        (value: boolean) => {
            setRememberDetailsState(value);
            if (!value) {
                localStorage.removeItem(STORAGE_KEY);
            } else {
                // Save current state immediately when toggled on
                setPrimaryAccount((p) => {
                    setCloneAccounts((c) => {
                        saveToLocalStorage(p, c);
                        return c;
                    });
                    return p;
                });
            }
        },
        [saveToLocalStorage]
    );

    // Functional updater avoids stale closure bugs
    const addAccount = useCallback(
        () => setCloneAccounts((prev) => [...prev, createDefaultAccount({ selected: true })]),
        []
    );

    const removeAccount = useCallback(
        (index: number) => setCloneAccounts((prev) => prev.filter((_, i) => i !== index)),
        []
    );

    return (
        <AccountsContext.Provider
            value={{
                primaryAccount,
                setPrimaryAccount,
                cloneAccounts,
                setCloneAccounts,
                rememberDetails,
                setRememberDetails,
                addAccount,
                removeAccount,
                addons,
                setAddons,
                alert,
                setAlert,
            }}
        >
            {children}
        </AccountsContext.Provider>
    );
};

export const useAccounts = () => {
    const ctx = useContext(AccountsContext);
    if (!ctx) throw new Error("useAccounts must be used within AccountsProvider");
    return ctx;
};
