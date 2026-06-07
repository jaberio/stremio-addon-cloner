import { Account } from "../types/accounts";

type ValidationResult = { valid: boolean; error?: string };

export function validateAccount(
    account: Account,
    accountType: string
): ValidationResult {
    if (account.mode === "credentials") {
        if (!account.email || !account.password) {
            return { valid: false, error: `${accountType} account email and password are required.` };
        }
    } else if (account.mode === "authkey") {
        if (!account.authkey) {
            return { valid: false, error: `${accountType} account auth key is required.` };
        }
    }
    return { valid: true };
}

export function validateCloneAccounts(cloneAccounts: Account[]): ValidationResult {
    const selectedAccounts = cloneAccounts.filter((acc) => acc.selected);

    if (selectedAccounts.length === 0) {
        return { valid: false, error: "At least one clone account must be selected." };
    }

    for (const acc of selectedAccounts) {
        const index = cloneAccounts.indexOf(acc);

        if (acc.mode === "credentials") {
            if (!acc.email || !acc.password) {
                return {
                    valid: false,
                    error: `Clone account #${index + 1}: Email and password are required.`,
                };
            }
        } else if (acc.mode === "authkey") {
            if (!acc.authkey) {
                return { valid: false, error: `Clone account #${index + 1}: Auth key is required.` };
            }
        }

        if (acc.is_debrid_override && (!acc.debrid_type || !acc.debrid_key)) {
            return { valid: false, error: `Clone account #${index + 1}: Debrid override requires both a provider and key.` };
        }
    }
    return { valid: true };
}
