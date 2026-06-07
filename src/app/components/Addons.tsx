"use client";
import { Addon } from "../types/addon";
import SortableAddonList from "./SortableAddonList";

type Props = {
    addons: Addon[];
    onChange: (newAddons: Addon[]) => void;
};

/**
 * Addon list with checkboxes — used by AddonSelector for clone selection.
 * Thin wrapper around the unified SortableAddonList.
 */
export default function AddonsDragAndDrop({ addons, onChange }: Props) {
    return (
        <SortableAddonList
            addons={addons}
            onChange={onChange}
            showCheckboxes={true}
            showDelete={false}
            showEdit={false}
        />
    );
}
