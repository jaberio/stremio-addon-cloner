import { Account } from "../types/accounts";
import { AddonData } from "../types/addon";
import { AddonsResponse } from "../types/apiResponse";

async function handleApiResponse<T>(res: Response): Promise<T> {
    const result = await res.json();
    if (!res.ok || !result.success) {
        throw new Error(result?.error || `Request failed with status ${res.status}`);
    }
    return result;
}

export async function fetchAddons(account: Account) {
    const res = await fetch("/api/addons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
    });

    const result = await handleApiResponse<AddonsResponse>(res);
    if (!result.success) throw new Error("Unknown error");
    return result.addons;
}

export async function cloneAddons(
    primaryAccount: Account,
    cloneAccounts: Account[],
    addons: AddonData[]
) {
    const res = await fetch("/api/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            primary: primaryAccount,
            clones: cloneAccounts,
            addons,
        }),
    });

    return handleApiResponse(res);
}

export async function updateAddons(
    account: Account,
    updatedAddons: AddonData[]
) {
    const res = await fetch("/api/updateAddons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            account,
            addons: updatedAddons,
        }),
    });

    return handleApiResponse<AddonsResponse>(res);
}
