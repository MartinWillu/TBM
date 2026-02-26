import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { createGrocery, updateGrocery } from "../api/storeOwnerApi";
import type { Grocery } from "../types";
import { GenericForm } from "./GenericForm";

type GroceryFormProps = {
    storeId: number;
    onGroceryCreated?: (grocery: Grocery) => void;
    onGroceryUpdated?: (grocery: Grocery) => void;
    onCancel?: () => void;
    initialGrocery?: Grocery | null;
};

export function GroceryForm({ storeId, onGroceryCreated, onGroceryUpdated, onCancel, initialGrocery }: GroceryFormProps) {
    const isEditMode = !!initialGrocery;
    const [formData, setFormData] = useState({
        name: "",
        currentPrice: "",
        oldPrice: "",
        quantity: "",
        imageUrl: "",
        categoryId: ""
    });
    const [groceryError, setGroceryError] = useState<string | null>(null);
    const [grocerySubmitting, setGrocerySubmitting] = useState(false);

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
            setFormData({
                name: "",
                currentPrice: "",
                oldPrice: "",
                quantity: "",
                imageUrl: "",
                categoryId: ""
            });
        }
    }, [initialGrocery]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const name = formData.name.trim();
        const currentPrice = Number(formData.currentPrice);
        const oldPrice = Number(formData.oldPrice || 0);
        const quantity = Number(formData.quantity);
        const categoryId = Number(formData.categoryId);
        const validations = [
            { condition: !name, message: "Grocery name is required." },
            { condition: !Number.isFinite(currentPrice) || currentPrice < 0, message: "Current price must be 0 or higher." },
            { condition: !Number.isFinite(quantity) || quantity < 0, message: "Quantity must be 0 or higher." },
            { condition: !Number.isFinite(categoryId) || categoryId <= 0, message: "Category ID must be a positive number." },
        ];

        for (const { condition, message } of validations) {
            if (condition) {
                setGroceryError(message);
                setTimeout(() => setGroceryError(null), 3000);
                return;
            }
        }

        setGrocerySubmitting(true);
        setGroceryError(null);
        try {
            if (isEditMode && initialGrocery) {
                const updated = await updateGrocery(initialGrocery.id, {
                    name,
                    currentPrice,
                    oldPrice: Number.isFinite(oldPrice) && oldPrice > 0 ? oldPrice : 0,
                    quantity,
                    imageUrl: formData.imageUrl.trim() || undefined,
                    storeId: initialGrocery.storeId,
                    categoryId,
                });
                if (onGroceryUpdated) onGroceryUpdated(updated);
            } else {
                const created = await createGrocery({
                    name,
                    currentPrice,
                    oldPrice: Number.isFinite(oldPrice) && oldPrice > 0 ? oldPrice : 0,
                    quantity,
                    imageUrl: formData.imageUrl.trim() || undefined,
                    storeId,
                    categoryId,
                });
                if (onGroceryCreated) onGroceryCreated(created);
                setFormData({
                    name: "",
                    currentPrice: "",
                    oldPrice: "",
                    quantity: "",
                    imageUrl: "",
                    categoryId: ""
                });
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : `Failed to ${isEditMode ? 'update' : 'create'} grocery.`;
            setGroceryError(message);
            setTimeout(() => setGroceryError(null), 3000);
        } finally {
            setGrocerySubmitting(false);
        }
    }

    const fields = [
        { name: "name", placeholder: "Grocery name", type: "text" },
        { name: "currentPrice", placeholder: "Current price", type: "number", min: 0, step: 0.01 },
        { name: "oldPrice", placeholder: "Old price", type: "number", min: 0, step: 0.01 },
        { name: "quantity", placeholder: "Quantity", type: "number", min: 0, step: 1 },
        { name: "imageUrl", placeholder: "Image URL (optional)", type: "text" },
        { name: "categoryId", placeholder: "Category ID", type: "number", min: 1, step: 1 },
    ];

    return (
        <div style={{ position: 'relative' }}>
            {isEditMode && onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    style={{ position: 'absolute', right: 0, top: 0, padding: '4px 8px', fontSize: '12px' }}
                >
                    Cancel Edit
                </button>
            )}
            <GenericForm
                title={isEditMode ? "Edit Grocery" : "Add New Grocery"}
                submitLabel={isEditMode ? "Save Changes" : "Add Grocery"}
                isSubmitting={grocerySubmitting}
                error={groceryError}
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
            </GenericForm>
        </div>
    );
}
