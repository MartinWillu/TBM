import { useEffect, useState } from "react";
import "../styles/HomePage.css";
import { useNavigate } from "react-router"
import LogoutBox from "../components/LogoutBox";

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
    {
      id: 1,
      name: "Rema 1000",
      logoUrl:
        "https://tse1.mm.bing.net/th/id/OIP.v4jdCUgpCbqI5q0trEHTfQHaE8?w=860&h=575&rs=1&pid=ImgDetMain&o=7&rm=3",
      groceries: [{ id: 12 }],
      groceryId: 0,
      userId: 101,
    },
    {
      id: 2,
      name: "Coop Extra",
      logoUrl:
        "https://hemsedal.com/imager/images/Bedrifter/Coop-Extra/3699/coop_extra_logo_pms_1ecb4b10adc4b0ab711970f16c823e0e.jpg",
      groceries: [{ id: 23 }],
      groceryId: 0,
      userId: 102,
    },
    {
      id: 3,
      name: "Meny",
      logoUrl: "https://1cetera.dk/wp-content/uploads/2012/03/meny-logo.png",
      groceries: [{ id: 1 }],
      groceryId: 0,
      userId: 103 as any,
    },
        {
      id: 3,
      name: "Meny1",
      logoUrl: "https://1cetera.dk/wp-content/uploads/2012/03/meny-logo.png",
      groceries: [{ id: 1 }],
      groceryId: 0,
      userId: 103 as any,
    },
        {
      id: 3,
      name: "Meny2",
      logoUrl: "https://1cetera.dk/wp-content/uploads/2012/03/meny-logo.png",
      groceries: [{ id: 1 }],
      groceryId: 0,
      userId: 103 as any,
    },
        {
      id: 3,
      name: "Meny3",
      logoUrl: "https://1cetera.dk/wp-content/uploads/2012/03/meny-logo.png",
      groceries: [{ id: 1 }],
      groceryId: 0,
      userId: 103 as any,
    },
        {
      id: 3,
      name: "Meny4",
      logoUrl: "https://1cetera.dk/wp-content/uploads/2012/03/meny-logo.png",
      groceries: [{ id: 1 }],
      groceryId: 0,
      userId: 103 as any,
    },
        {
      id: 3,
      name: "Meny5",
      logoUrl: "https://1cetera.dk/wp-content/uploads/2012/03/meny-logo.png",
      groceries: [{ id: 1 }],
      groceryId: 0,
      userId: 103 as any,
    },
  ];
  return new Promise((resolve) => setTimeout(() => resolve(mock), 500));
}

export function HomePage() {
  const navigator = useNavigate();
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