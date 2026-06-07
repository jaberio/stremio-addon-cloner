import { DEBRID_OPTIONS } from "./debridOptions";

/**
 * TorrentsDb uses a unique format: { [providerName]: apiKey }
 * This doesn't fit the generic base64 pattern, so it has its own implementation.
 */
export function setTorrentsDbDebridProvider(
    url: string,
    newProvider: string,
    newKey: string
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
                // Remove all existing debrid keys
                for (const key of Object.keys(payload)) {
                    if (DEBRID_OPTIONS.some((debrid) => key === debrid.value && key !== "")) {
                        delete payload[key];
                    }
                }
            } catch {
                throw new Error("Unable to decode torrentsDb configuration");
            }
        }

        // Set new provider key directly: { torbox: "abc123" }
        payload[newProvider] = newKey;

        const updatedEncoded = Buffer.from(JSON.stringify(payload)).toString("base64");
        return `${link.protocol}//${link.host}/${updatedEncoded}/manifest.json`;
    } catch (err) {
        if (err instanceof Error && err.message.startsWith("Unable to decode")) {
            throw err;
        }
        throw new Error(`Failed to override debrid provider for torrentsDb: ${err}`);
    }
}
