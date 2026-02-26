import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { createGrocery, updateGrocery, type CreateGroceryPayload } from "../api/storeOwnerApi";
import type { Grocery } from "../types";
import { GenericForm } from "./GenericForm";

type GroceryFormProps = {
    storeId: number;
    onGroceryUpdated?: (grocery: Grocery) => void;
    onGroceryCreated?: (grocery: Grocery) => void;
    onCancel?: () => void;
    initialGrocery?: Grocery | null;
};

const INITIAL_STATE = {
    name: "",
    currentPrice: "",
    oldPrice: "",
    quantity: "",
    imageUrl: "",
    categoryId: ""
};

const FORM_FIELDS = [
    { name: "name", placeholder: "Grocery name", type: "text" },
    { name: "currentPrice", placeholder: "Current price", type: "number", min: 0, step: 0.01 },
    { name: "oldPrice", placeholder: "Old price (optional)", type: "number", min: 0, step: 0.01 },
    { name: "quantity", placeholder: "Quantity", type: "number", min: 0, step: 1 },
    { name: "imageUrl", placeholder: "Image URL (optional)", type: "text" },
    { name: "categoryId", placeholder: "Category ID", type: "number", min: 1, step: 1 },
];

export function GroceryForm({ storeId, onGroceryCreated, onGroceryUpdated, onCancel, initialGrocery }: GroceryFormProps) {
    const isEditMode = Boolean(initialGrocery);
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialGrocery) {
            setFormData({
                name: initialGrocery.name,
                currentPrice: initialGrocery.currentPrice.toString(),
                oldPrice: initialGrocery.oldPrice.toString(),
                quantity: initialGrocery.quantity.toString(),
                imageUrl: initialGrocery.imageUrl || "",
                categoryId: initialGrocery.categoryId?.toString() || ""
            });
        } else {
            setFormData(INITIAL_STATE);
        }
    }, [initialGrocery]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const name = formData.name.trim();
        const currentPrice = Number(formData.currentPrice);
        const quantity = Number(formData.quantity);
        const categoryId = Number(formData.categoryId);

        if (!name) return "Grocery name is required.";
        if (currentPrice < 0) return "Current price must be 0 or higher.";
        if (quantity < 0) return "Quantity must be 0 or higher.";
        if (categoryId <= 0) return "Category ID must be a positive number.";

        return null;
    };

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            setTimeout(() => setError(null), 3000);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const oldPrice = Number(formData.oldPrice || 0);
            const payload: CreateGroceryPayload = {
                name: formData.name.trim(),
                currentPrice: Number(formData.currentPrice),
                oldPrice: Number.isFinite(oldPrice) && oldPrice > 0 ? oldPrice : 0,
                quantity: Number(formData.quantity),
                imageUrl: formData.imageUrl.trim() || undefined,
                storeId: isEditMode && initialGrocery ? initialGrocery.storeId : storeId,
                categoryId: Number(formData.categoryId),
            };

            if (isEditMode && initialGrocery) {
                const updated = await updateGrocery(initialGrocery.id, payload);
                onGroceryUpdated?.(updated);
            } else {
                const created = await createGrocery(payload);
                onGroceryCreated?.(created);
                setFormData(INITIAL_STATE);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} grocery.`;
            setError(message);
            setTimeout(() => setError(null), 3000);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div style={{ position: 'relative' }}>
            <GenericForm
                title={isEditMode ? "Edit Grocery" : "Add New Grocery"}
                submitLabel={isEditMode ? "Save Changes" : "Add Grocery"}
                isSubmitting={isSubmitting}
                error={error}
                onSubmit={handleSubmit}
            >
                {FORM_FIELDS.map((field) => (
                    <input
                        key={field.name}
                        className="form-input"
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleChange}
                        min={field.min}
                        step={field.step}
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
