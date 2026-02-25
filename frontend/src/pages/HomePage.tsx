import { useEffect, useState } from "react";
import "../styles/HomePage.css";
import type { Grocery, Store } from "../types";
import { fetchGroceries, fetchStores } from "../api/fetchApi";
import { StoreCard } from "../components/StoreCard";
import { GroceryCard } from "../components/GroceryCard";
import { useNavigate } from "react-router";

export function HomePage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [groceriesData, setGroceriesData] = useState<Grocery[]>([]);
  const navigate = useNavigate();

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

  return (
    <>
      <div className="home-hero">
        <div className="container text-center">
          <h1>The Forbidden Fridge</h1>
          <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>Select a store or browse all groceries</p>
        </div>
      </div>

      <div className="container">
        <main>
          {loading && <p className="text-center">Loading stores...</p>}
          {!loading && err && <p className="error">{err}</p>}

          {!loading && !err && (
            <section className="home-container">
              <div className="home-column">
                <h2 className="home-section-title">Stores</h2>
                <div className="card-grid">
                  {stores.map((s) => (
                    <StoreCard
                      key={s.id}
                      store={s}
                      onClick={() => navigate(`/store?storeId=${s.id}`)}
                    />
                  ))}
                </div>
              </div>

              <div className="home-column">
                <h2 className="home-section-title">All Groceries</h2>
                {groceriesData.length === 0 && <p className="text-center">No groceries yet.</p>}
                <div className="card-grid">
                  {groceriesData.map((g) => (
                    <GroceryCard
                      key={g.id}
                      grocery={g}
                      onClick={() => navigate(`/grocery?groceryName=${encodeURIComponent(g.name)}`)}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}