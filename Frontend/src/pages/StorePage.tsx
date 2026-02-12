
import { useMemo, useState, useEffect } from "react";
import { StoreCard } from "../components/StoreCard";
import { SearchBar } from "../components/SearchBar";
import { fetchStores, fetchGroceries } from "../api/fetchApi";
import { GroceryCard } from "../components/GroceryCard";

type Store = {
  id: number;
  name: string;
  logoUrl: string;
  userId: number;
};

type Grocery = {
    logoUrl: string | undefined;
    id: number;
    name: string;
    currentPrice: number;
    oldPrice: number;
    quantity: number;
    storeId: number;
    categoryId?: number; 
}

export function StorePage() {
  const [query, setQuery] = useState("");
  const [storesData, setStoresData] = useState<Store[]>([]);
  const [groceriesData, setGroceriesData] = useState<Grocery[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

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
    setSelectedStore(store);
  }

  // -----------------------------
  // 🟢 SHOW GROCERIES FOR STORE
  // -----------------------------
  if (selectedStore) {
    const groceriesForStore = groceriesData.filter(
      (g) => g.storeId === selectedStore.id
    );

    return (
      <div>
        <button onClick={() => setSelectedStore(null)}>← Back to stores</button>
        <h1>{selectedStore.name} - Groceries</h1>

        {groceriesForStore.length === 0 && <p>No groceries found.</p>}

        
          {groceriesForStore.map((g) => (
          <GroceryCard key={g.id} grocery={g} />

        ))}
      </div>
    );
  }

  // -----------------------------
  // 🟦 SHOW STORE LIST
  // -----------------------------
  return (
    <div>
      <h1>Stores</h1>

      <div style={{ marginBottom: 16 }}>
        <SearchBar value={query} onChange={setQuery} placeholder="Search by name" />
      </div>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        }}
      >
        {filtered.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onClick={handleStoreClick}  // 👈 CLICK HANDLER ADDED
          />
        ))}
      </div>
    </div>
  );
}
