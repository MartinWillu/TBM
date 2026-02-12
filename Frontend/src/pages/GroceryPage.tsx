import { useEffect, useState } from "react";
import type { Grocery, Store } from "../types";
import { fetchGroceries, fetchStores } from "../api/fetchApi";
import { formatCurrency, isOnSale } from "../utils/pricing";
import { useNavigate } from "react-router";

export function GroceryPage() {
    const [stores, setStores] = useState<Store[]>([]);
    const [groceries, setGroceries] = useState<Grocery[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const navigate = useNavigate();

  

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
        
      <h1>Groceries</h1>
      </header>

      <main>
        <section>
            <div className="column">
              {/* If there are no stores */}
              <h2>Groceries</h2>
              {groceries.length === 0 && <p>No groceries yet.</p>}

              {/* Store cards */}
              {groceries.map((g) => {
                const sale = isOnSale(g);
                
                return (
                  <div className={`flex-item ${sale ? "is-sale" : ""}`} key={g.id}
                  onClick={() => navigate(`/`)}
                  style={{ cursor: "pointer" }}>
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
      </main>
    </>
  );
}