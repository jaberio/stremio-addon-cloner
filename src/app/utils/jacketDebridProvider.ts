import { setBase64DebridProvider } from "./base64DebridProvider";

export function setJacketDebridProvider(
    url: string,
    newProvider: string,
    newKey: string
): string {
    return setBase64DebridProvider(
        url,
        "debridId",
        "debridApiKey",
        newProvider,
        newKey,
        "jackettio"
    );
}
