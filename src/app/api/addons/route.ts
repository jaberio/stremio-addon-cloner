import { NextResponse } from "next/server";
import type { Account } from "@/app/types/accounts";
import { getAuth, getAddons } from "@/app/lib/stremio-client";
import { AddonData } from "@/app/types/addon";
import { AddonsResponse } from "@/app/types/apiResponse";

export async function POST(req: Request) {
    let body: Account;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { success: false, addons: [], error: "Invalid JSON body" },
            { status: 400 }
        );
    }

    // Input validation
    if (!body.mode) {
        return NextResponse.json(
            { success: false, addons: [], error: "Missing account mode" },
            { status: 400 }
        );
    }

    if (body.mode === "credentials" && (!body.email || !body.password)) {
        return NextResponse.json(
            { success: false, addons: [], error: "Email and password are required" },
            { status: 400 }
        );
    }

    if (body.mode === "authkey" && !body.authkey) {
        return NextResponse.json(
            { success: false, addons: [], error: "Auth key is required" },
            { status: 400 }
        );
    }

    try {
        const auth = await getAuth(body);
        const primaryAddons: AddonData[] = await getAddons(auth);

        const response: AddonsResponse = {
            success: true,
            addons: primaryAddons,
        };

        return NextResponse.json(response, { status: 200 });
    } catch (err: unknown) {
        console.error("Error fetching addons:", err);

        const response: AddonsResponse = {
            success: false,
            addons: [],
            error: err instanceof Error ? err.message : "Unknown error occurred",
        };

        return NextResponse.json(response, { status: 500 });
    }
}
