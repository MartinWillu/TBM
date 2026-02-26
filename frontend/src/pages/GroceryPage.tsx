import { useState, useMemo } from "react";
import type { Grocery, Store } from "../types";
import { useInventory } from "../hooks/useInventory";
import { useNavigate, useSearchParams } from "react-router";
import { GroceryCard } from "../components/GroceryCard";
import { StoreCard } from "../components/StoreCard";
import { GroceryForm } from "../components/GroceryForm";
import { StoreForm } from "../components/StoreForm";
import { decodeRole } from "../utils/jwtDecoder";
import { Roles } from "../types";

export function GroceryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { groceries, stores, loading, error: err, removeStore, updateStore, removeGrocery, updateGrocery } = useInventory();
  const navigate = useNavigate();
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [editingGrocery, setEditingGrocery] = useState<Grocery | null>(null);

  const role = decodeRole();
  const canManage = role === Roles.Admin || role === Roles.StoreOwner;

  const selectedGroceryName = searchParams.get("groceryName");

  function handleStartUpdateStore(store: Store) {
    setEditingStore(store);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleStoreUpdated(updated: Store) {
    updateStore(updated);
    setEditingStore(null);
  }

  function handleStartUpdateGrocery(grocery: Grocery) {
    setEditingGrocery(grocery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleGroceryUpdated(updated: Grocery) {
    updateGrocery(updated);
    setEditingGrocery(null);
  }

  const uniqueGroceries = useMemo(() => {
    const map = new Map<string, Grocery>();
    for (const g of groceries) {
      if (!map.has(g.name)) {
        map.set(g.name, g);
      }
    }
    return Array.from(map.values());
  }, [groceries]);

  const matchingGroceries = useMemo(() => {
    if (!selectedGroceryName) {
      return [];

    }
    const lower = selectedGroceryName.toLowerCase();
    return groceries.filter(g => g.name.toLowerCase() === lower);
  }, [groceries, selectedGroceryName]);

  const storesWithGrocery = useMemo(() => {
    if (matchingGroceries.length === 0) {
      return [];
    }
    const storeIds = new Set(matchingGroceries.map(g => g.storeId));
    return stores.filter(s => storeIds.has(s.id));
  }, [stores, matchingGroceries]);


  if (selectedGroceryName) {
    return (
      <div className="container">
        <button onClick={() => setSearchParams({})} style={{ marginBottom: "1rem" }}>← Back to groceries</button>
        <h1>Stores with "{selectedGroceryName}"</h1>

        {editingStore && (
          <StoreForm
            initialStore={editingStore}
            onStoreUpdated={handleStoreUpdated}
            onCancel={() => setEditingStore(null)}
          />
        )}

        {storesWithGrocery.length === 0 && <p className="text-center">No stores found.</p>}

        <div className="card-grid">
          {storesWithGrocery.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onClick={() => navigate(`/store?storeId=${store.id}`)}
              onEdit={canManage ? () => handleStartUpdateStore(store) : undefined}
              onDelete={canManage ? () => removeStore(store.id) : undefined}
            />
          ))}
        </div>
      </div>
    );
  }


  return (
    <>
      <h1>Groceries</h1>

      {loading && <p>Loading groceries...</p>}
      {!loading && err && <p style={{ color: "tomato" }}>{err}</p>}

      {!loading && !err && (
        <section className="container">
          <div className="flex-center" style={{ flexDirection: 'column' }}>
            {uniqueGroceries.length === 0 && <p className="text-center">No groceries yet.</p>}

            {editingGrocery && (
              <div style={{ marginBottom: "1rem" }}>
                <GroceryForm
                  storeId={editingGrocery.storeId}
                  initialGrocery={editingGrocery}
                  onGroceryUpdated={handleGroceryUpdated}
                  onCancel={() => setEditingGrocery(null)}
                />
              </div>
            )}

            <div className="card-grid">
              {uniqueGroceries.map((g) => (
                <GroceryCard
                  key={g.id}
                  grocery={g}
                  onClick={() => setSearchParams({ groceryName: g.name })}
                  onEdit={canManage ? () => handleStartUpdateGrocery(g) : undefined}
                  onDelete={canManage ? () => removeGrocery(g.id) : undefined}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}