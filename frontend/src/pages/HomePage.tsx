import { useEffect, useState } from "react";
import "../styles/HomePage.css";
import type { Grocery, Store } from "../types";
import { fetchGroceries, fetchStores } from "../api/fetchApi";
import { StoreCard } from "../components/StoreCard";
import { GroceryCard } from "../components/GroceryCard";

export function HomePage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [groceriesData, setGroceriesData] = useState<Grocery[]>([]);


  function handleStoreClick(store: Store) {
    setSelectedStore(store);
  }

  useEffect(() => {
    async function load() {
      try {
        const storesData = await fetchStores();
        setStores(storesData);
        const groceries = await fetchGroceries();
        setGroceriesData(groceries);
      } catch {
        setErr("Failed to load stores");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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


  return (
    <>
      <header>

        <h1>The Forbidden Fridge</h1>
      </header>

      <main>
        {loading && <p>Loading stores…</p>}
        {!loading && err && <p style={{ color: "tomato" }}>{err}</p>}

        {!loading && !err && (
          <section className="flex-container">

            <div className="column">
              <h2>Your stores</h2>



              {stores.map((s) => (

                <StoreCard store={s} onClick={() => handleStoreClick(s)} />

              ))}
            </div>
            <div className="column">

              <h2>Your groceries</h2>
              {groceriesData.length === 0 && <p>No groceries yet.</p>}

              {groceriesData.map((g) => {

                return (
                  <div >
                    {<GroceryCard grocery={g} />}
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </main>
    </>
  );
}