import { DebridType } from "../utils/debridOptions";

export type Account = {
    /** Stable unique identifier for React keys and tracking */
    id: string;
    mode: "credentials" | "authkey";
    email: string;
    password: string;
    authkey: string;
    is_debrid_override: boolean;
    debrid_type: DebridType;
    debrid_key: string;
    clone_mode: "sync" | "append";
    selected?: boolean;
};
