import packageJson from "@/../package.json";
import Link from "next/link";

const Footer = () => {
    return (
        <footer
            className="w-full mt-auto py-6 text-center text-xs"
            style={{
                borderTop: "1px solid var(--border-subtle)",
                color: "var(--text-muted)",
            }}
        >
            <div className="space-y-2 max-w-5xl mx-auto px-6">
                <p className="flex items-center justify-center gap-1.5">
                    ☕
                    <Link
                        href="https://buymeacoffee.com/jay_me"
                        target="_blank"
                        className="transition-colors hover:underline"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Buy me a coffee
                    </Link>
                </p>

                <p style={{ color: "var(--text-muted)" }}>
                    Originally created by{" "}
                    <a
                        href="https://github.com/oozmakafa/stremio-account-addon-cloner"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Oozmakafa
                    </a>
                    {" · "}
                    Improved & maintained by{" "}
                    <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Jay</span>
                </p>

                <div className="flex items-center justify-center gap-3">
                    <a
                        href="https://github.com/jaberio/stremio-addon-cloner"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:underline"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        GitHub
                    </a>
                    <span style={{ color: "var(--border-strong)" }}>·</span>
                    <span
                        className="font-mono px-2 py-0.5"
                        style={{
                            background: "var(--bg-elevated)",
                            borderRadius: "var(--radius-full)",
                            color: "var(--text-muted)",
                            fontSize: "0.6875rem",
                        }}
                    >
                        v{packageJson.version}
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
