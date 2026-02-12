


type Store = {
  id: number;
  name: string;
  logoUrl: string;
  userId: number;
};
// StoreCard.tsx
type Props = {
  store: Store;
};

export function StoreCard({ store }: Props) {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "12px",
      borderRadius: "8px",
      width: "200px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      {/* Logo */}
      <img
        src={store.logoUrl}
        alt={store.name}
        style={{ width: "80px", height: "80px", objectFit: "contain" }}
      />

      {/* Name */}
      <p style={{ marginTop: "10px", fontWeight: "bold" }}>
        {store.name}
      </p>
    </div>
  );
}
