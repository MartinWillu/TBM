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
      <header>
        <h1>Groceries</h1>
      </header>

      <main>
        {loading && <p>Loading stores…</p>}
        {!loading && err && <p style={{ color: "tomato" }}>{err}</p>}

        {!loading && !err && (
          <section>
            <div className="column">
              <h2>Groceries</h2>
              {groceries.length === 0 && <p>No groceries yet.</p>}
              <div
                style={{
                  display: "grid",
                  gap: "12px",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                }}
              >
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
      </main>
    </>
  );
}