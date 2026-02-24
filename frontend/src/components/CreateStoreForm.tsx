import { useState } from "react";
import type { FormEvent } from "react";
import { createStore } from "../api/storeOwnerApi";
import type { Store } from "../types";

type Props = {
    onStoreCreated: (store: Store) => void;
};

export function CreateStoreForm({ onStoreCreated }: Props) {
    const [storeName, setStoreName] = useState("");
    const [storeLogoUrl, setStoreLogoUrl] = useState("");
    const [storeError, setStoreError] = useState<string | null>(null);
    const [storeSubmitting, setStoreSubmitting] = useState(false);

    async function handleCreateStore(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const name = storeName.trim();
        if (!name) {
            setStoreError("Store name is required.");
            return;
        }

        setStoreSubmitting(true);
        setStoreError(null);
        try {
            const created = await createStore({
                name,
                logoUrl: storeLogoUrl.trim() || undefined,
            });
            onStoreCreated(created);
            setStoreName("");
            setStoreLogoUrl("");
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to create store.";
            setStoreError(message);
        } finally {
            setStoreSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleCreateStore} style={{ marginBottom: 16 }}>
            <h2>Create store</h2>
            <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
                <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Store name"
                />
                <input
                    type="text"
                    value={storeLogoUrl}
                    onChange={(e) => setStoreLogoUrl(e.target.value)}
                    placeholder="Logo URL (optional)"
                />
                {storeError && <p style={{ color: "tomato" }}>{storeError}</p>}
                <button type="submit" disabled={storeSubmitting}>
                    {storeSubmitting ? "Creating..." : "Create store"}
                </button>
            </div>
        </form>
    );
}
