import {useEffect, useState } from "react";
import "../styles/HomePage.css";

// define store - should be moved to separate file later
type Store = {
    id: number;
    name: string;
    logoUrl?: string;
    userId: number;
    groceryId: number;
    groceries?: any[];
};


// --- MOCK: replace this later with a real fetch call ---
function fetchStoresMock(): Promise<Store[]> {
  const mock: Store[] = [
    { id: 1, name: "Rema 1000", logoUrl: "https://tse1.mm.bing.net/th/id/OIP.v4jdCUgpCbqI5q0trEHTfQHaE8?w=860&h=575&rs=1&pid=ImgDetMain&o=7&rm=3", groceries: [{id: 12}], groceryId: 0, userId: 101 },
    { id: 2, name: "Coop Extra", logoUrl: "https://hemsedal.com/imager/images/Bedrifter/Coop-Extra/3699/coop_extra_logo_pms_1ecb4b10adc4b0ab711970f16c823e0e.jpg", groceries: [{id: 23}], groceryId: 0, userId: 102 },
    { id: 3, name: "Meny", logoUrl: "https://1cetera.dk/wp-content/uploads/2012/03/meny-logo.png", groceries: [{ id: 1 }], groceryId: 0, userId: 103 as any },
  ];
  return new Promise((resolve) => setTimeout(() => resolve(mock), 500));
}




export function HomePage() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

   
    useEffect(() => {
        async function load() {
        try {
            const data = await fetchStoresMock(); // ⬅️ mocked for now
            setStores(data);
        } catch (e: any) {
            setErr(e.message ?? "Failed to load stores");
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

        {!loading && !err && (
          <section className="flex-container">
            {/* sees if theres any stores*/}
            {stores.length === 0 && <p>No stores yet.</p>}

            {/* for each store in stores it creates a card*/}
            <div >
            {stores.map((s) => (
              <div className="flex-item"
                //className="butikk"
                key={s.id}

              >
                {s.logoUrl && (
                  <img
                    src={s.logoUrl}
                    alt=""
                    style={{ width: 140, height: "100%", objectFit: "cover", borderRadius: 10, marginBottom: 10 }}
                    onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                  />
                )}
                <h3 style={{ margin: "0 0 6px" }}>{s.name}</h3>
                <p style={{ margin: 0, color: "#ffffff" }}>Butikk: {s.name}</p>
                {Array.isArray(s.groceries) && <p style={{ marginTop: 8 }}>{s.groceries.length} items</p>}
              </div>
            ))}
            </div>
          </section>
        )}

            </main>
        </>
    )
}

