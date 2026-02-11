import { useEffect, useState } from "react";
import "../styles/HomePage.css";
import type { Store } from "../types";
import { fetchStores } from "../api/fetchApi";

export function HomePage() {
  const navigator = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchStores();
        setStores(data);
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
      <header>
        
        <h1>The Forbidden Fridge</h1>
        <LogoutBox />
      </header>

      <main>
        {loading && <p>Loading stores…</p>}
        {!loading && err && <p style={{ color: "tomato" }}>{err}</p>}

        {!loading && !err && (
          <section className="flex-container">
            {/* If you add more columns later, wrap each in .column */}
            <div className="column">
              <h2>Stores</h2>
              {/* If there are no stores */}
              {stores.length === 0 && <p>No stores yet.</p>}

              {/* Store cards */}
              {stores.map((s) => (
                <div className="flex-item" key={s.id}>
                  {s.logoUrl && (
                    <img
                      className="flex-item__image"
                      src={s.logoUrl}
                      alt={`${s.name} logo`}   // small accessibility improvement
                      onError={(e) =>
                      ((e.currentTarget as HTMLImageElement).style.display =
                        "none")
                      }
                    />
                  )}
                  <h3>{s.name}</h3>
                  <p>Butikk: {s.name}</p>
                  {Array.isArray(s.groceries) && (
                    <p>{s.groceries.length} items</p>
                  )}
                  <button className="myButton" onClick={() => console.log("Clicked!")}>
                    See more
                  </button>
                </div>
              ))}
            </div>
            <div className="column">
              {/* If there are no stores */}
              <h2>Groceries</h2>
              {stores.length === 0 && <p>No stores yet.</p>}

              {/* Store cards */}
              {stores.map((s) => (
                <div className="flex-item" key={s.id}>
                  {s.logoUrl && (
                    <img
                      className="flex-item__image"
                      src={s.logoUrl}
                      alt={`${s.name} logo`}   // small accessibility improvement
                      onError={(e) =>
                      ((e.currentTarget as HTMLImageElement).style.display =
                        "none")
                      }
                    />
                  )}
                  <h3>{s.name}</h3>
                  <p>Butikk: {s.name}</p>
                  {Array.isArray(s.groceries) && (
                    <p>{s.groceries.length} items</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}