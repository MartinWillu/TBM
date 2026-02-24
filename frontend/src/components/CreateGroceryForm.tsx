import { useState } from "react";
import type { FormEvent } from "react";
import { createGrocery } from "../api/storeOwnerApi";
import type { Grocery } from "../types";
import "./Styles/Auth.css";

type Props = {
    storeId: number;
    onGroceryCreated: (grocery: Grocery) => void;
};

export function CreateGroceryForm({ storeId, onGroceryCreated }: Props) {
    const [groceryName, setGroceryName] = useState("");
    const [groceryPrice, setGroceryPrice] = useState("");
    const [groceryOldPrice, setGroceryOldPrice] = useState("");
    const [groceryQuantity, setGroceryQuantity] = useState("");
    const [groceryImageUrl, setGroceryImageUrl] = useState("");
    const [groceryCategoryId, setGroceryCategoryId] = useState("");
    const [groceryError, setGroceryError] = useState<string | null>(null);
    const [grocerySubmitting, setGrocerySubmitting] = useState(false);

    async function handleCreateGrocery(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const name = groceryName.trim();
        const currentPrice = Number(groceryPrice);
        const oldPrice = Number(groceryOldPrice || 0);
        const quantity = Number(groceryQuantity);
        const categoryId = Number(groceryCategoryId);

        if (!name) {
            setGroceryError("Grocery name is required.");
            return;
        }
        if (!Number.isFinite(currentPrice) || currentPrice < 0) {
            setGroceryError("Current price must be 0 or higher.");
            return;
        }
        if (!Number.isFinite(quantity) || quantity < 0) {
            setGroceryError("Quantity must be 0 or higher.");
            return;
        }
        if (!Number.isFinite(categoryId) || categoryId <= 0) {
            setGroceryError("Category ID must be a positive number.");
            return;
        }

        setGrocerySubmitting(true);
        setGroceryError(null);
        try {
            const created = await createGrocery({
                name,
                currentPrice,
                oldPrice: Number.isFinite(oldPrice) && oldPrice > 0 ? oldPrice : 0,
                quantity,
                imageUrl: groceryImageUrl.trim() || undefined,
                storeId,
                categoryId,
            });
            onGroceryCreated(created);
            setGroceryName("");
            setGroceryPrice("");
            setGroceryOldPrice("");
            setGroceryQuantity("");
            setGroceryImageUrl("");
            setGroceryCategoryId("");
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to create grocery.";
            setGroceryError(message);
        } finally {
            setGrocerySubmitting(false);
        }
    }

    return (
        <form onSubmit={handleCreateGrocery} className="auth-container" style={{ margin: "20px auto", maxWidth: "420px", padding: "20px" }}>
            <h3 className="auth-title" style={{ fontSize: "1.25rem", margin: "0 0 16px" }}>Add New Grocery</h3>
            <div className="auth-input-group">
                <input
                    className="auth-input"
                    type="text"
                    value={groceryName}
                    onChange={(e) => setGroceryName(e.target.value)}
                    placeholder="Grocery name"
                />
                <input
                    className="auth-input"
                    type="number"
                    min={0}
                    step="0.01"
                    value={groceryPrice}
                    onChange={(e) => setGroceryPrice(e.target.value)}
                    placeholder="Current price"
                />
                <input
                    className="auth-input"
                    type="number"
                    min={0}
                    step="0.01"
                    value={groceryOldPrice}
                    onChange={(e) => setGroceryOldPrice(e.target.value)}
                    placeholder="Old price"
                />
                <input
                    className="auth-input"
                    type="number"
                    min={0}
                    step="1"
                    value={groceryQuantity}
                    onChange={(e) => setGroceryQuantity(e.target.value)}
                    placeholder="Quantity"
                />
                <input
                    className="auth-input"
                    type="text"
                    value={groceryImageUrl}
                    onChange={(e) => setGroceryImageUrl(e.target.value)}
                    placeholder="Image URL (optional)"
                />
                <input
                    className="auth-input"
                    type="number"
                    min={1}
                    step="1"
                    value={groceryCategoryId}
                    onChange={(e) => setGroceryCategoryId(e.target.value)}
                    placeholder="Category ID"
                />
                {groceryError && <p className="error" style={{ margin: "10px 0" }}>{groceryError}</p>}
                <button type="submit" className="auth-button" disabled={grocerySubmitting}>
                    {grocerySubmitting ? "Adding..." : "Add Grocery"}
                </button>
            </div>
        </form>
    );
}
