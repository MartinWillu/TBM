import { useState } from "react";
import type { FormEvent } from "react";
import { createStore } from "../api/storeOwnerApi";
import type { Store } from "../types";
import { GenericForm } from "./GenericForm";

type CreateStoreFormProps = {
    onStoreCreated: (store: Store) => void;
};

export function CreateStoreForm({ onStoreCreated }: CreateStoreFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        logoUrl: ""
    });
    const [storeError, setStoreError] = useState<string | null>(null);
    const [storeSubmitting, setStoreSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    async function handleCreateStore(event: FormEvent<HTMLFormElement>) {
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
            const created = await createStore({
                name,
                logoUrl: formData.logoUrl.trim() || undefined,
            });
            onStoreCreated(created);
            setFormData({ name: "", logoUrl: "" });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to create store.";
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
        <GenericForm
            title="Create New Store"
            submitLabel="Create Store"
            isSubmitting={storeSubmitting}
            error={storeError}
            onSubmit={handleCreateStore}
        >
            {fields.map((field) => (
                <input
                    key={field.name}
                    className="auth-input"
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleChange}
                />
            ))}
        </GenericForm>
    );
}
