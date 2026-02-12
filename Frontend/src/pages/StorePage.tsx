
import { useMemo, useState, useEffect } from "react";
import { StoreCard } from "../components/StoreCard";
import { SearchBar } from "../components/SearchBar"; // adjust path as needed
//import stores from "../mocks/data/stores.json";
import { fetchStores } from "../api/fetchApi";

type Store = {
  id: number;
  name: string;
  logoUrl: string;
  userId: number;
};

export function StorePage() {
  const [query, setQuery] = useState("");
  const [storesData, setStoresData] = useState<Store[]>([]);
  const Allstores = storesData as Store[];
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

 

  useEffect(() => {
      async function load() {
        try {
          const data = await fetchStores();
          setStoresData(data);
        } catch {
          setErr("Failed to load stores");
        } finally {
          setLoading(false);
        }
      }
      load();
    }, []);


  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return Allstores;
    return Allstores.filter((s) => s.name.toLowerCase().includes(q));
  }, [Allstores, query]);

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
          alignItems: "start",
        }}
      >
        {filtered.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>

     
      {filtered.length === 0 && (
        <div style={{ marginTop: 24, color: "#777" }}>
          No stores match “{query}”. Try another search.
        </div>
      )}
    </div>
  );
}
