import { useState, useEffect, useCallback } from "react";
import { fetchStores, fetchGroceries } from "../api/fetchApi";
import { deleteStore as apiDeleteStore, deleteGrocery as apiDeleteGrocery } from "../api/storeOwnerApi";
import type { Store, Grocery } from "../types";

export function useInventory() {
    const [stores, setStores] = useState<Store[]>([]);
    const [groceries, setGroceries] = useState<Grocery[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [storesData, groceriesData] = await Promise.all([
                fetchStores(),
                fetchGroceries()
            ]);
            setStores(storesData);
            setGroceries(groceriesData);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load inventory");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addStore = useCallback((store: Store) => {
        setStores(prev => [store, ...prev]);
    }, []);

    const updateStore = useCallback((updated: Store) => {
        setStores(prev => prev.map(s => s.id === updated.id ? updated : s));
    }, []);

    const removeStore = useCallback(async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this store?")) return;
        try {
            await apiDeleteStore(id);
            setStores(prev => prev.filter(s => s.id !== id));
        } catch (e) {
            alert(e instanceof Error ? e.message : "Failed to delete store");
        }
    }, []);

    const addGrocery = useCallback((grocery: Grocery) => {
        setGroceries(prev => [{ ...grocery, logoUrl: grocery.imageUrl ?? "" }, ...prev]);
    }, []);

    const updateGrocery = useCallback((updated: Grocery) => {
        const normalized = { ...updated, logoUrl: updated.imageUrl ?? "" };
        setGroceries(prev => prev.map(g => g.id === updated.id ? normalized : g));
    }, []);

    const removeGrocery = useCallback(async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this grocery?")) return;
        try {
            await apiDeleteGrocery(id);
            setGroceries(prev => prev.filter(g => g.id !== id));
        } catch (e) {
            alert(e instanceof Error ? e.message : "Failed to delete grocery");
        }
    }, []);

    return {
        stores,
        groceries,
        loading,
        error,
        addStore,
        updateStore,
        removeStore,
        addGrocery,
        updateGrocery,
        removeGrocery,
        refresh
    };
}
