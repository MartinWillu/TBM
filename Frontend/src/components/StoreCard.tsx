
type Store = {
  id: number;
  name: string;
  logoUrl: string;
  userId: number;
};

type Props = {
  store: Store;
  onClick?: (store: Store) => void; 
};

export function StoreCard({ store, onClick }: Props) {
  return (
    <div
      onClick={() => onClick?.(store)}  
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        borderRadius: "8px",
        width: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        backgroundColor: "#4a4343"              
      }}
    >
      <img
        src={store.logoUrl}
        alt={store.name}
        style={{ width: "120px", height: "120px", objectFit: "contain" }}
        
      />

      <p style={{ marginTop: "10px", fontWeight: "bold" }}>
        {store.name}
      </p>
    </div>
  );
}

