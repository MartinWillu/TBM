import { useEffect, useState, useMemo } from "react";
import type { Grocery, Store } from "../types";
import { fetchGroceries, fetchStores } from "../api/fetchApi";
import { useNavigate, useSearchParams } from "react-router";
import { GroceryCard } from "../components/GroceryCard";
import { StoreCard } from "../components/StoreCard";

export function GroceryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [groceries, setGroceries] = useState<Grocery[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const selectedGroceryName = searchParams.get("groceryName");

  useEffect(() => {
    async function load() {
      try {
        const [groceriesData, storesData] = await Promise.all([
          fetchGroceries(),
          fetchStores()
        ]);
        setGroceries(groceriesData);
        setStores(storesData);
      } catch {
        setErr("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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

        {storesWithGrocery.length === 0 && <p className="text-center">No stores found.</p>}

        <div className="card-grid">
          {storesWithGrocery.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onClick={() => navigate(`/store?storeId=${store.id}`)}
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

            <div className="card-grid">
              {uniqueGroceries.map((g) => (
                <GroceryCard
                  key={g.id}
                  grocery={g}
                  onClick={() => setSearchParams({ groceryName: g.name })}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}