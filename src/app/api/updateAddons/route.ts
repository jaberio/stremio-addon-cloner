import { NextResponse } from "next/server";
import { getAddons, getAuth, pushAddonCollection } from "@/app/lib/stremio-client";
import { AddonData } from "@/app/types/addon";
import { AddonsResponse } from "@/app/types/apiResponse";

export async function POST(req: Request) {
    let body: { account: unknown; addons: unknown };

    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { success: false, addons: [], error: "Invalid JSON body" },
            { status: 400 }
        );
    }

    const { account, addons } = body;

    if (!account || !Array.isArray(addons)) {
        return NextResponse.json(
            { success: false, addons: [], error: "Missing account or addons" },
            { status: 400 }
        );
    }

    try {
        const auth = await getAuth(account as Parameters<typeof getAuth>[0]);
        await pushAddonCollection(auth, addons);

        const updatedAddons: AddonData[] = await getAddons(auth);

        const response: AddonsResponse = {
            success: true,
            addons: updatedAddons,
        };

        return NextResponse.json(response, { status: 200 });
    } catch (err: unknown) {
        console.error("Error updating addon collection:", err);

        const response: AddonsResponse = {
            success: false,
            addons: [],
            error: err instanceof Error ? err.message : "Unknown error occurred",
        };

        return NextResponse.json(response, { status: 500 });
    }
}
