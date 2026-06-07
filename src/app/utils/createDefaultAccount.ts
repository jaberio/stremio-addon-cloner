import { Account } from "../types/accounts";

/**
 * Creates a new Account with sensible defaults and a unique ID.
 * Use this everywhere instead of duplicating the default shape.
 */
export function createDefaultAccount(overrides?: Partial<Account>): Account {
    return {
        id: typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString(36) + Math.random().toString(36).slice(2),
        mode: "credentials",
        email: "",
        password: "",
        authkey: "",
        is_debrid_override: false,
        debrid_type: "",
        debrid_key: "",
        clone_mode: "sync",
        ...overrides,
    };
}
