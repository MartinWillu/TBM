import { useNavigate } from "react-router";
import { useInventory } from "../hooks/useInventory";
import { GroceryCard } from "../components/GroceryCard";
import { StoreCard } from "../components/StoreCard";
import "../styles/HomePage.css";

export function HomePage() {
  const { stores, groceries, loading, error } = useInventory();
  const navigate = useNavigate();

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
          {!loading && error && <p className="error">{error}</p>}

          {!loading && !error && (
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
                {groceries.length === 0 && <p className="text-center">No groceries yet.</p>}
                <div className="card-grid">
                  {groceries.map((g) => (
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