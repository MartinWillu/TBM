
import { useMemo, useState } from "react";
import { StoreCard } from "../components/StoreCard";
import { SearchBar } from "../components/SearchBar"; // adjust path as needed
import stores from "../mocks/data/stores.json";

type Store = {
  id: number;
  name: string;
  logoUrl: string;
  userId: number;
};

export function StorePage() {
  const [query, setQuery] = useState("");
  const Allstores = stores as Store[];

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
