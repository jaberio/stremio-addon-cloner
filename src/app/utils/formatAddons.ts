import { AddonData, Addon } from "../types/addon";

/**
 * Converts raw AddonData[] from the Stremio API into UI-ready Addon[] objects.
 * Shared by AddonSelector and ConfigurePrimary to eliminate duplication.
 *
 * @param addons - Raw addons from the API
 * @param preCheckActive - If true, disabled addons (name includes "[DISABLED]") are unchecked by default
 */
export function formatAddonDataForUI(
    addons: AddonData[],
    preCheckActive: boolean = false
): Addon[] {
    return addons.map((addon) => ({
        addon,
        id: addon.transportUrl,
        name: addon.manifest.name,
        is_protected: addon.flags.protected,
        is_configurable: addon.manifest?.behaviorHints?.configurable ?? false,
        checked: preCheckActive
            ? !addon.manifest.name.includes("[DISABLED]")
            : true,
        uuid: typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString(36) + Math.random().toString(36).slice(2),
    }));
}
