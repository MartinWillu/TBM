import { useEffect, useState } from "react";
import "../styles/HomePage.css";
import type { Grocery, Store } from "../types";
import { fetchGroceries, fetchStores } from "../api/fetchApi";
import { formatCurrency, isOnSale } from "../utils/pricing";


export function HomePage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [groceries, setGroceries] = useState<Grocery[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  

  useEffect(() => {
    async function load() {
      try {
        const storesData = await fetchStores();
        setStores(storesData);

        const groceriesData = await fetchGroceries();
        setGroceries(groceriesData);
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
      </header>

      <main>
        {loading && <p>Loading stores…</p>}
        {!loading && err && <p style={{ color: "tomato" }}>{err}</p>}

        {!loading && !err && (
          <section className="flex-container">
            {/* If you add more columns later, wrap each in .column */}
            <div className="column">
              <h2>Your stores</h2>
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
                </div>
              ))}
            </div>
            <div className="column">
              {/* If there are no stores */}
              <h2>Your groceries</h2>
              {groceries.length === 0 && <p>No groceries yet.</p>}

              {/* Store cards */}
              {groceries.map((g) => {
                const sale = isOnSale(g);
                
                return (
                  <div className={`flex-item ${sale ? "is-sale" : ""}`} key={g.id}>
                    {g.logoUrl && (
                      <img
                        className="flex-item__image"
                        src={g.logoUrl}
                        alt={`${g.name} logo`}   // small accessibility improvement
                        onError={(e) =>
                        ((e.currentTarget as HTMLImageElement).style.display =
                          "none")
                        }
                      />
                    )}
                    <h3>{g.name}</h3>
                    
                    {sale ? (
                      <p aria-label={`On sale. Now ${g.currentPrice}, was ${g.oldPrice}`}>
                        <span className="price price--current">
                          {formatCurrency(g.currentPrice, "NOK", "nb-NO")}
                        </span>{" "}
                        <span className="price price--old" aria-hidden="true">
                          {formatCurrency(g.oldPrice!, "NOK", "nb-NO")}
                        </span>
                        <br />
                        Quantity: {g.quantity}
                      </p>
                    ):(
                      <p>
                        Current price: {formatCurrency(g.currentPrice, "NOK", "nb-NO")}
                        <br /> 
                        Quantity: {g.quantity}
                      </p>
                    )}
                  </div>
              )})}
            </div>
          </section>
        )}
      </main>
    </>
  );
}