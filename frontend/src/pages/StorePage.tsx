import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { StoreCard } from "../components/StoreCard";
import { SearchBar } from "../components/SearchBar";
import { useInventory } from "../hooks/useInventory";
import { GroceryCard } from "../components/GroceryCard";
import { StoreForm } from "../components/StoreForm";
import { GroceryForm } from "../components/GroceryForm";
import { decodeRole } from "../utils/jwtDecoder";
import type { Store, Grocery } from "../types";
import { Roles } from "../types";

export function StorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { stores, groceries, loading, error, removeStore, updateStore, addStore, removeGrocery, updateGrocery, addGrocery } = useInventory();
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [editingGrocery, setEditingGrocery] = useState<Grocery | null>(null);

  const selectedStoreIdStr = searchParams.get("storeId");
  const selectedStore = useMemo(() => {
    if (!selectedStoreIdStr) {
      return null;
    }
    return stores.find(s => s.id === Number(selectedStoreIdStr)) || null;
  }, [stores, selectedStoreIdStr]);

  const role = decodeRole();
  const canManage = role === Roles.Admin || role === Roles.StoreOwner;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return stores;
    }
    return stores.filter((s) => s.name.toLowerCase().includes(q));
  }, [stores, query]);

  async function handleStoreClick(store: Store) {
    setSearchParams({ storeId: store.id.toString() });
  }

  async function handleRemoveStore(id: number) {
    await removeStore(id);
    if (selectedStore?.id === id) {
      setSearchParams({});
    }
  }

  async function handleStartUpdateStore(store: Store) {
    setEditingStore(store);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleStoreUpdated(updated: Store) {
    updateStore(updated);
    setEditingStore(null);
  }

  async function handleStartUpdateGrocery(grocery: Grocery) {
    setEditingGrocery(grocery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleGroceryUpdated(updated: Grocery) {
    updateGrocery(updated);
    setEditingGrocery(null);
  }

  if (selectedStore) {
    const groceriesForStore = groceries.filter(
      (g) => g.storeId === selectedStore.id
    );

    return (
      <div className="container">
        <button onClick={() => setSearchParams({})} style={{ marginBottom: "1rem" }}>← Back to stores</button>
        <h1>{selectedStore.name} - Groceries</h1>

        {loading && <p className="text-center">Loading stores...</p>}
        {!loading && error && <p className="error">{error}</p>}

        {canManage && (
          <div style={{ marginBottom: "1rem" }}>
            <GroceryForm
              storeId={selectedStore.id}
              initialGrocery={editingGrocery}
              onGroceryCreated={(grocery) => addGrocery(grocery)}
              onGroceryUpdated={handleGroceryUpdated}
              onCancel={() => setEditingGrocery(null)}
            />
          </div>
        )}

        {groceriesForStore.length === 0 && <p className="text-center">No groceries found.</p>}

        <div className="card-grid">
          {groceriesForStore.map((g) => (
            <GroceryCard
              key={g.id}
              grocery={g}
              onClick={() => navigate(`/grocery?groceryName=${encodeURIComponent(g.name)}`)}
              onEdit={canManage ? () => handleStartUpdateGrocery(g) : undefined}
              onDelete={canManage ? () => removeGrocery(g.id) : undefined}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Stores</h1>

      {canManage && (
        <StoreForm
          initialStore={editingStore}
          onStoreCreated={(store) => addStore(store)}
          onStoreUpdated={handleStoreUpdated}
          onCancel={() => setEditingStore(null)}
        />
      )}

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by name"
        />
      </div>

      <div className="card-grid">
        {filtered.map((store: Store) => (
          <StoreCard
            key={store.id}
            store={store}
            onClick={handleStoreClick}
            onEdit={canManage ? () => handleStartUpdateStore(store) : undefined}
            onDelete={canManage ? () => handleRemoveStore(store.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
