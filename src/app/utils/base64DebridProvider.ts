/**
 * Generic base64 debrid provider override for addons that encode config as base64 JSON
 * in the first URL path segment (comet, jackettio, torrentsDb, etc.)
 *
 * @param url - The addon's transportUrl (manifest.json URL)
 * @param providerField - The JSON key for the debrid provider (e.g. "debridService", "debridId")
 * @param keyField - The JSON key for the debrid API key (e.g. "debridApiKey")
 * @param newProvider - The new provider value
 * @param newKey - The new API key value
 * @param addonName - Human-readable addon name for error messages
 * @param cleanupFn - Optional function to clean existing keys from the payload before setting new ones
 */
export function setBase64DebridProvider(
    url: string,
    providerField: string,
    keyField: string,
    newProvider: string,
    newKey: string,
    addonName: string,
    cleanupFn?: (payload: Record<string, unknown>) => void
): string {
    try {
        const link = new URL(url);
        const pathParts = link.pathname.split("/").filter(Boolean);

        let payload: Record<string, unknown> = {};
        const encodedPayload = pathParts[0];

        if (encodedPayload && encodedPayload !== "manifest.json") {
            try {
                const decoded = Buffer.from(encodedPayload, "base64").toString("utf-8");
                payload = JSON.parse(decoded);
            } catch {
                throw new Error(`Unable to decode ${addonName} configuration`);
            }
        }

        // Run cleanup if provided (e.g. remove all existing debrid keys)
        if (cleanupFn) {
            cleanupFn(payload);
        }

        // Set new provider and key
        payload[providerField] = newProvider;
        payload[keyField] = newKey;

        const updatedEncoded = Buffer.from(JSON.stringify(payload)).toString("base64");
        return `${link.protocol}//${link.host}/${updatedEncoded}/manifest.json`;
    } catch (err) {
        if (err instanceof Error && err.message.startsWith("Unable to decode")) {
            throw err;
        }
        throw new Error(`Failed to override debrid provider for ${addonName}: ${err}`);
    }
}
