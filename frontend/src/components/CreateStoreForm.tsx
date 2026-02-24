import { useState } from "react";
import type { FormEvent } from "react";
import { createStore } from "../api/storeOwnerApi";
import type { Store } from "../types";
import "./Styles/Auth.css";

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
        <form onSubmit={handleCreateStore} className="auth-container" style={{ margin: "20px auto", maxWidth: "420px", padding: "20px" }}>
            <h3 className="auth-title" style={{ fontSize: "1.25rem", margin: "0 0 16px" }}>Create New Store</h3>
            <div className="auth-input-group">
                <input
                    className="auth-input"
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Store name"
                />
                <input
                    className="auth-input"
                    type="text"
                    value={storeLogoUrl}
                    onChange={(e) => setStoreLogoUrl(e.target.value)}
                    placeholder="Logo URL (optional)"
                />
                {storeError && <p className="error" style={{ margin: "10px 0" }}>{storeError}</p>}
                <button type="submit" className="auth-button" disabled={storeSubmitting}>
                    {storeSubmitting ? "Creating..." : "Create Store"}
                </button>
            </div>
        </form>
    );
}
