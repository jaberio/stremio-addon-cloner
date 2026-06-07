export async function fetchAddonManifest(manifestUrl: string) {
    const res = await fetch(manifestUrl);
    if (!res.ok) {
        throw new Error(`Failed to fetch manifest: ${res.statusText || "Unknown error"}`);
    }
    return res.json();
}