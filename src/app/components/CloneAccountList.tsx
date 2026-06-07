import { UserPlus } from "lucide-react";
import CloneAccountForm from "./CloneAccountForm";
import { useAccounts } from "../hooks/useAccounts";
import AddonSelector from "./AddonSelector";

export default function CloneAccountList() {
    const { cloneAccounts: accounts, addAccount, setCloneAccounts } = useAccounts();

    const handleBulkChange = (checked: boolean) => {
        setCloneAccounts((prev) => prev.map((acc) => ({ ...acc, selected: checked })));
    };

    const allSelected = accounts.length > 0 && accounts.every((acc) => acc.selected);

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
                    Target Accounts
                </h2>
                <label
                    className="flex items-center space-x-2 cursor-pointer select-none"
                    title="Select or deselect all accounts"
                >
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => handleBulkChange(e.target.checked)}
                        className="h-4 w-4 rounded border-[var(--border-default)] bg-[var(--bg-input)]
                            checked:bg-[var(--accent-primary)] checked:border-[var(--accent-primary)]
                            focus:ring-2 focus:ring-[var(--accent-glow)] cursor-pointer transition-all"
                    />
                    <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                        Select All
                    </span>
                </label>
            </div>

            <div className="mb-4">
                <AddonSelector />
            </div>

            {/* Grid layout — accounts side by side on desktop */}
            <div className="accounts-grid">
                {accounts.map((acc) => (
                    <CloneAccountForm
                        key={acc.id}
                        index={accounts.indexOf(acc)}
                        account={acc}
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={addAccount}
                className="mt-3 flex items-center justify-center w-full gap-2 py-2.5 text-sm transition-all group"
                style={{
                    borderRadius: "var(--radius-md)",
                    border: "1px dashed var(--border-default)",
                    background: "transparent",
                    color: "var(--text-muted)",
                }}
            >
                <UserPlus className="w-4 h-4 group-hover:text-[var(--accent-primary)] transition-colors" />
                <span className="group-hover:text-[var(--text-secondary)] transition-colors">Add Account</span>
            </button>
        </section>
    );
}
