export default function TargetAccountsSeparator() {
    return (
        <div className="relative flex items-center my-2">
            <div
                className="flex-grow h-px"
                style={{ background: "var(--gradient-separator)" }}
            />
            <span
                className="px-3 py-0.5 text-[10px] font-semibold tracking-widest uppercase"
                style={{
                    background: "var(--bg-page)",
                    borderRadius: "var(--radius-full)",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-muted)",
                }}
            >
                Clone To
            </span>
            <div
                className="flex-grow h-px"
                style={{ background: "var(--gradient-separator)" }}
            />
        </div>
    );
}