export interface AddonFlags {
    protected: boolean;
    official?: boolean;
}

export interface BehaviorHints {
    configurable?: boolean;
    adult?: boolean;
    p2p?: boolean;
}

export interface AddonManifest {
    id: string;
    name: string;
    behaviorHints?: BehaviorHints;
    types?: string[];
    resources?: { name: string; types?: string[]; idPrefixes?: string[] }[];
    catalogs?: { type: string; id: string; name?: string }[];
    version?: string;
    description?: string;
}

/** Raw addon data as returned by the Stremio API */
export interface AddonData {
    flags: AddonFlags;
    manifest: AddonManifest;
    transportUrl: string;
    transportName?: string;
}

/** UI-enriched addon used in the frontend components */
export interface Addon {
    id: string;
    name: string;
    is_protected: boolean;
    is_configurable: boolean;
    checked: boolean;
    addon: AddonData;
    uuid: string;
}
