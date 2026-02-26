import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { StoreCard } from "../components/StoreCard";
import { SearchBar } from "../components/SearchBar";
import { fetchStores, fetchGroceries } from "../api/fetchApi";
import { deleteStore, deleteGrocery } from "../api/storeOwnerApi";
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
  const [storesData, setStoresData] = useState<Store[]>([]);
  const [groceriesData, setGroceriesData] = useState<Grocery[]>([]);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [editingGrocery, setEditingGrocery] = useState<Grocery | null>(null);

  const selectedStoreIdStr = searchParams.get("storeId");
  const selectedStore = useMemo(() => {
    if (!selectedStoreIdStr) {
      return null;
    }
    return storesData.find(s => s.id === Number(selectedStoreIdStr)) || null;
  }, [storesData, selectedStoreIdStr]);

  const role = decodeRole();
  const canManage = role === Roles.Admin || role === Roles.StoreOwner;

  useEffect(() => {
    async function load() {
      const stores = await fetchStores();
      const groceries = await fetchGroceries();
      setStoresData(stores);
      setGroceriesData(groceries);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return storesData;
    return storesData.filter((s) => s.name.toLowerCase().includes(q));
  }, [storesData, query]);

  function handleStoreClick(store: Store) {
    setSearchParams({ storeId: store.id.toString() });
  }

  async function handleDeleteStore(id: number) {
    if (!window.confirm("Are you sure you want to delete this store?")) {
      return;
    }
    try {
      await deleteStore(id);
      setStoresData(prev => prev.filter(s => s.id !== id));
      if (selectedStore?.id === id) {
        setSearchParams({});
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete store");
    }
  }

  async function handleUpdateStore(store: Store) {
    setEditingStore(store);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleStoreUpdated(updated: Store) {
    setStoresData(prev => prev.map(s => s.id === updated.id ? updated : s));
    setEditingStore(null);
  }

  async function handleDeleteGrocery(id: number) {
    if (!window.confirm("Are you sure you want to delete this grocery?")) {
      return;
    }
    try {
      await deleteGrocery(id);
      setGroceriesData((prev) => prev.filter((g) => g.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete grocery");
    }
  }

  async function handleUpdateGrocery(grocery: Grocery) {
    setEditingGrocery(grocery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleGroceryUpdated(updated: Grocery) {
    setGroceriesData(prev => prev.map(g => g.id === updated.id ? normalizeGrocery(updated) : g));
    setEditingGrocery(null);
  }

  function normalizeGrocery(grocery: Grocery) {
    const record = grocery as Grocery & { imageUrl?: string };
    if (record.imageUrl) return record;
    return { ...record, logoUrl: record.imageUrl ?? "" };
  }

  if (selectedStore) {
    const groceriesForStore = groceriesData.filter(
      (g) => g.storeId === selectedStore.id
    );

    return (
      <div className="container">
        <button onClick={() => setSearchParams({})} style={{ marginBottom: "1rem" }}>← Back to stores</button>
        <h1>{selectedStore.name} - Groceries</h1>

        {canManage && (
          <div style={{ marginBottom: "1rem" }}>
            <GroceryForm
              storeId={selectedStore.id}
              initialGrocery={editingGrocery}
              onGroceryCreated={(created) =>
                setGroceriesData((prev) => [normalizeGrocery(created), ...prev])
              }
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
              onEdit={canManage ? () => handleUpdateGrocery(g) : undefined}
              onDelete={canManage ? () => handleDeleteGrocery(g.id) : undefined}
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
          onStoreCreated={(created) =>
            setStoresData((prev) => [created, ...prev])
          }
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
            onEdit={canManage ? () => handleUpdateStore(store) : undefined}
            onDelete={canManage ? () => handleDeleteStore(store.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
