import { setBase64DebridProvider } from "./base64DebridProvider";

export function setCometDebridProvider(
    url: string,
    newProvider: string,
    newKey: string
): string {
    return setBase64DebridProvider(
        url,
        "debridService",
        "debridApiKey",
        newProvider,
        newKey,
        "comet"
    );
}
