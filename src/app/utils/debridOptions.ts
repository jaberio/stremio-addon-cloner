const DEBRID_OPTIONS = [
    { value: "", label: "Select Debrid", url: "" },
    { value: "torbox", label: "Torbox", url: "https://torbox.app/settings" },
    { value: "realdebrid", label: "RealDebrid", url: "https://real-debrid.com/apitoken" },
    { value: "offcloud", label: "OffCloud", url: "https://offcloud.com/#/account" },
    { value: "alldebrid", label: "AllDebrid", url: "https://alldebrid.com/" },
    { value: "easydebrid", label: "EasyDebrid", url: "https://easydebrid.com/" },
    { value: "premiumize", label: "Premiumize", url: "https://www.premiumize.me/" },
] as const;

/** Union of all valid debrid provider values (excluding the empty placeholder) */
export type DebridType = (typeof DEBRID_OPTIONS)[number]["value"];

const SUPPORTED_ADDONS_DEBRID_OVERRIDE = ["torrentio", "comet", "jackettio", "torrentsdb"] as const;

export { DEBRID_OPTIONS, SUPPORTED_ADDONS_DEBRID_OVERRIDE };
