import { useEffect, useState } from "react";
import type { Grocery } from "../types";
import { fetchGroceries } from "../api/fetchApi";
import { useNavigate } from "react-router";
import { GroceryCard } from "../components/GroceryCard";

export function GroceryPage() {
  const [groceries, setGroceries] = useState<Grocery[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
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
      <h1>Groceries</h1>

      {loading && <p>Loading groceries...</p>}
      {!loading && err && <p style={{ color: "tomato" }}>{err}</p>}

      {!loading && !err && (
        <section className="container">
          <div className="flex-center" style={{ flexDirection: 'column' }}>
            {groceries.length === 0 && <p className="text-center">No groceries yet.</p>}

            <div className="card-grid">
              {groceries.map((g) => (
                <GroceryCard
                  key={g.id}
                  grocery={g}
                  onClick={() => navigate(`/`)} // consider `/groceries/${g.id}` later
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}