import type { Store } from "../types";
import "./Styles/Card.css";

type Props = {
  store: Store;
  onClick?: (store: Store) => void;
  onEdit?: (store: Store) => void;
  onDelete?: (id: number) => void;
};

export function StoreCard({ store, onClick, onEdit, onDelete }: Props) {
  return (
    <div
      className="card"
      onClick={() => onClick?.(store)}
    >
      <img
        src={store.logoUrl}
        alt={store.name}
        className="card-image"
      />

      <h3 className="card-title">
        {store.name}
      </h3>

      {(onEdit || onDelete) && (
        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
          {onEdit && <button onClick={() => onEdit(store)}>Edit</button>}
          {onDelete && <button onClick={() => onDelete(store.id)} style={{ backgroundColor: '#ff4444' }}>Delete</button>}
        </div>
      )}
    </div>
  );
}

