"use client";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    TouchSensor,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    AlertTriangle,
    Copy,
    Edit2,
    ExternalLink,
    GripVertical,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Addon } from "../types/addon";

type SortableAddonListProps = {
    addons: Addon[];
    onChange: (newAddons: Addon[]) => void;
    showCheckboxes?: boolean;
    showDelete?: boolean;
    showEdit?: boolean;
    onRequestDelete?: (uuid: string) => void;
    onRequestEdit?: (addon: Addon) => void;
};

/* -------------------------------------------------------
   Single Sortable Item
   ------------------------------------------------------- */
function SortableAddonItem({
    addon,
    showCheckboxes,
    showDelete,
    showEdit,
    onToggleCheck,
    onRequestDelete,
    onRequestEdit,
}: {
    addon: Addon;
    showCheckboxes: boolean;
    showDelete: boolean;
    showEdit: boolean;
    onToggleCheck: (uuid: string) => void;
    onRequestDelete?: (uuid: string) => void;
    onRequestEdit?: (addon: Addon) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: addon.uuid });

    const disabled = addon.addon?.transportUrl?.startsWith("disabled:");

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-md)] select-none touch-none transition-all duration-200
                ${disabled
                    ? "bg-[var(--bg-elevated)] opacity-60 border border-dashed border-[var(--border-default)]"
                    : "glass-strong card-interactive"
                }`}
        >
            {/* Left side */}
            <div className="flex items-center space-x-2.5 min-w-0">
                {showCheckboxes && (
                    <input
                        type="checkbox"
                        checked={addon.checked}
                        disabled={addon.is_protected}
                        onChange={() => onToggleCheck(addon.uuid)}
                        className="h-4.5 w-4.5 rounded border-[var(--border-default)] bg-[var(--bg-input)]
                            checked:bg-[var(--accent-primary)] checked:border-[var(--accent-primary)]
                            focus:ring-2 focus:ring-[var(--accent-glow)] cursor-pointer transition-all shrink-0"
                    />
                )}
                <span className={`text-sm truncate ${disabled ? "italic text-[var(--text-muted)]" : "text-[var(--text-secondary)]"}`}>
                    {addon.name}
                    {addon.is_protected && <span className="text-[var(--text-muted)] ml-1">(Protected)</span>}
                    {disabled && <span className="ml-1">(Disabled)</span>}
                </span>
            </div>

            {/* Right side — action buttons */}
            <div className="flex items-center space-x-1 shrink-0 ml-2">
                {showEdit && onRequestEdit && (
                    <button
                        onClick={() => onRequestEdit(addon)}
                        className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-subtle)] transition-all"
                        aria-label="Edit addon"
                        title="Edit addon"
                    >
                        <Edit2 size={16} />
                    </button>
                )}

                {/* Configure link */}
                {!addon.is_configurable || disabled ? (
                    <span
                        className="p-1.5 text-[var(--text-muted)] opacity-40 cursor-not-allowed"
                        title={disabled ? "Disabled addon" : "Not configurable"}
                    >
                        <ExternalLink size={16} />
                    </span>
                ) : (
                    <a
                        href={addon.id.replace("/manifest.json", "/configure")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)] transition-all"
                        aria-label="Open addon configuration"
                        title="Open addon configuration"
                    >
                        <ExternalLink size={16} />
                    </a>
                )}

                {/* Copy URL */}
                <button
                    onClick={() => navigator.clipboard.writeText(addon.id)}
                    disabled={disabled}
                    className={`p-1.5 rounded-[var(--radius-sm)] transition-all ${
                        disabled
                            ? "text-[var(--text-muted)] opacity-40 cursor-not-allowed"
                            : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)]"
                    }`}
                    aria-label="Copy manifest URL"
                    title={disabled ? "Disabled addon" : "Copy manifest URL"}
                >
                    <Copy size={16} />
                </button>

                {/* Delete */}
                {showDelete && onRequestDelete && (
                    <button
                        onClick={() => !addon.is_protected && onRequestDelete(addon.uuid)}
                        disabled={addon.is_protected}
                        className={`p-1.5 rounded-[var(--radius-sm)] transition-all ${
                            addon.is_protected
                                ? "text-[var(--text-muted)] opacity-40 cursor-not-allowed"
                                : "text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)]"
                        }`}
                        aria-label="Delete addon"
                        title={addon.is_protected ? "Protected addon" : "Delete addon"}
                    >
                        <Trash2 size={16} />
                    </button>
                )}

                {/* Drag handle */}
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    disabled={disabled}
                    className={`p-1.5 rounded-[var(--radius-sm)] transition-all ${
                        disabled
                            ? "text-[var(--text-muted)] opacity-40 cursor-not-allowed"
                            : "text-[var(--text-muted)] hover:text-[var(--accent-primary)] cursor-grab active:cursor-grabbing touch-none"
                    }`}
                    aria-label="Drag to reorder"
                    title={disabled ? "Cannot reorder" : "Drag to reorder"}
                >
                    <GripVertical size={16} />
                </button>
            </div>
        </div>
    );
}

/* -------------------------------------------------------
   Main List Component
   ------------------------------------------------------- */
export default function SortableAddonList({
    addons,
    onChange,
    showCheckboxes = false,
    showDelete = false,
    showEdit = false,
    onRequestDelete,
    onRequestEdit,
}: SortableAddonListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 250, tolerance: 10 },
        })
    );

    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        if (onRequestDelete || onRequestEdit) {
            // Let parent manage body overflow via their own modal state
        }
    }, [onRequestDelete, onRequestEdit]);

    const toggleAddonCheck = (uuid: string) => {
        const updated = addons.map((addon) =>
            addon.uuid === uuid ? { ...addon, checked: !addon.checked } : addon
        );
        onChange(updated);
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over) return;

        if (active.id !== over.id) {
            const oldIndex = addons.findIndex((a) => a.uuid === active.id);
            const newIndex = addons.findIndex((a) => a.uuid === over.id);
            const updated = arrayMove(addons, oldIndex, newIndex);

            const firstBefore = addons[0];
            if (firstBefore?.is_protected && updated[0]?.uuid !== firstBefore.uuid) {
                setShowWarning(true);
            } else {
                setShowWarning(false);
            }

            onChange(updated);
        }
    };

    return (
        <div className="space-y-2">
            {showWarning && (
                <div className="flex items-start space-x-2 p-3 rounded-[var(--radius-md)] animate-fade-in"
                    style={{ background: "var(--color-warning-subtle)", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                    <AlertTriangle className="flex-shrink-0 mt-0.5 text-[var(--color-warning)]" size={18} />
                    <p className="text-sm text-[var(--color-warning)]">
                        Moving a protected addon may break Stremio functionality!
                    </p>
                </div>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={addons.map((a) => a.uuid)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-1.5">
                        {addons.map((addon) => (
                            <SortableAddonItem
                                key={addon.uuid}
                                addon={addon}
                                showCheckboxes={showCheckboxes}
                                showDelete={showDelete}
                                showEdit={showEdit}
                                onToggleCheck={toggleAddonCheck}
                                onRequestDelete={onRequestDelete}
                                onRequestEdit={onRequestEdit}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
