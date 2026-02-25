import type { Store } from "../types";
import "./Styles/Card.css";

type Props = {
  store: Store;
  onClick?: (store: Store) => void;
};

export function StoreCard({ store, onClick }: Props) {
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
    </div>
  );
}

