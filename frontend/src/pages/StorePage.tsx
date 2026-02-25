import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { StoreCard } from "../components/StoreCard";
import { SearchBar } from "../components/SearchBar";
import { fetchStores, fetchGroceries } from "../api/fetchApi";
import { GroceryCard } from "../components/GroceryCard";
import { CreateStoreForm } from "../components/CreateStoreForm";
import { CreateGroceryForm } from "../components/CreateGroceryForm";
import { decodeRole } from "../utils/jwtDecoder";
import type { Store, Grocery } from "../types";
import { Roles } from "../types";

export function StorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [storesData, setStoresData] = useState<Store[]>([]);
  const [groceriesData, setGroceriesData] = useState<Grocery[]>([]);

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

  function normalizeGrocery(grocery: Grocery) {
    const record = grocery as Grocery & { imageUrl?: string };
    if (record.logoUrl) return record;
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
            <CreateGroceryForm
              storeId={selectedStore.id}
              onGroceryCreated={(created) =>
                setGroceriesData((prev) => [normalizeGrocery(created), ...prev])
              }
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
        <CreateStoreForm
          onStoreCreated={(created) =>
            setStoresData((prev) => [created, ...prev])
          }
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
          <StoreCard key={store.id} store={store} onClick={handleStoreClick} />
        ))}
      </div>
    </div>
  );
}
