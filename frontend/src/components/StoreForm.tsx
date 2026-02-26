import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { createStore, updateStore } from "../api/storeOwnerApi";
import type { Store } from "../types";
import { GenericForm } from "./GenericForm";

type StoreFormProps = {
    onStoreCreated?: (store: Store) => void;
    onStoreUpdated?: (store: Store) => void;
    onCancel?: () => void;
    initialStore?: Store | null;
};

export function StoreForm({ onStoreCreated, onStoreUpdated, onCancel, initialStore }: StoreFormProps) {
    const isEditMode = !!initialStore;
    const [formData, setFormData] = useState({
        name: "",
        logoUrl: ""
    });
    const [storeError, setStoreError] = useState<string | null>(null);
    const [storeSubmitting, setStoreSubmitting] = useState(false);

    useEffect(() => {
        if (initialStore) {
            setFormData({
                name: initialStore.name,
                logoUrl: initialStore.logoUrl || ""
            });
        } else {
            setFormData({ name: "", logoUrl: "" });
        }
    }, [initialStore]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const name = formData.name.trim();
        if (!name) {
            setStoreError("Store name is required.");
            setTimeout(() => setStoreError(null), 3000);
            return;
        }

        setStoreSubmitting(true);
        setStoreError(null);
        try {
            if (isEditMode && initialStore) {
                const updated = await updateStore(initialStore.id, {
                    name,
                    logoUrl: formData.logoUrl.trim() || undefined,
                });
                if (onStoreUpdated) onStoreUpdated(updated);
            } else {
                const created = await createStore({
                    name,
                    logoUrl: formData.logoUrl.trim() || undefined,
                });
                if (onStoreCreated) onStoreCreated(created);
                setFormData({ name: "", logoUrl: "" });
            }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : `Failed to ${isEditMode ? 'update' : 'create'} store.`;
            setStoreError(message);
            setTimeout(() => setStoreError(null), 3000);
        } finally {
            setStoreSubmitting(false);
        }
    }

    const fields = [
        { name: "name", placeholder: "Store name", type: "text" },
        { name: "logoUrl", placeholder: "Logo URL (optional)", type: "text" },
    ];

    return (
        <div style={{ position: 'relative' }}>
            <GenericForm
                title={isEditMode ? "Edit Store" : "Create New Store"}
                submitLabel={isEditMode ? "Save Changes" : "Create Store"}
                isSubmitting={storeSubmitting}
                error={storeError}
                onSubmit={handleSubmit}
            >
                {fields.map((field) => (
                    <input
                        key={field.name}
                        className="form-input"
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleChange}
                    />
                ))}
                {isEditMode && onCancel && (
                    <button
                        type="button"
                        className="form-input"
                        onClick={onCancel}
                        style={{ zIndex: 999 }}
                    >
                        Cancel Edit
                    </button>
                )}
            </GenericForm>
        </div>
    );
}
