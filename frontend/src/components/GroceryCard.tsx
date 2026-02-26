import type { Grocery } from "../types";
import { isOnSale, formatCurrency } from "../utils/pricing";
import "./Styles/Card.css";

type Props = {
  grocery: Grocery;
  onClick?: () => void;
  className?: string;
  onEdit?: (grocery: Grocery) => void;
  onDelete?: (id: number) => void;
};

export function GroceryCard({ grocery, onClick, className, onEdit, onDelete }: Props) {
  const sale = isOnSale(grocery);
  const hasImage = Boolean(grocery.imageUrl);

  const currentPriceLabel = formatCurrency(grocery.currentPrice, "NOK", "nb-NO");
  const oldPriceLabel =
    grocery.oldPrice != null
      ? formatCurrency(grocery.oldPrice, "NOK", "nb-NO")
      : undefined;

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className={`card ${className ?? ""}`}
      style={{ position: 'relative' }}
      aria-label={`${grocery.name}${sale ? " (On sale)" : ""}`}
    >
      {sale && <div className="card-badge">SALE</div>}

      {hasImage && (
        <img
          className="card-image"
          src={grocery.imageUrl!}
          alt={`${grocery.name} logo`}
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
      )}

      <h3 className="card-title">
        {grocery.name}
      </h3>

      <div className="card-details">
        {sale ? (
          <div aria-label={`On sale. Now ${currentPriceLabel}${oldPriceLabel ? `, was ${oldPriceLabel}` : ""}`}>
            <span className="card-price">{currentPriceLabel}</span>
            {oldPriceLabel && (
              <span className="card-price old" aria-hidden="true">
                {oldPriceLabel}
              </span>
            )}
          </div>
        ) : (
          <div>
            <span className="card-price">{currentPriceLabel}</span>
          </div>
        )}
        <div style={{ fontSize: '0.8em', marginTop: '4px', opacity: 0.8 }}>
          Quantity: {grocery.quantity}
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
          {onEdit && <button onClick={() => onEdit(grocery)}>Edit</button>}
          {onDelete && <button onClick={() => onDelete(grocery.id)} style={{ backgroundColor: '#ff4444' }}>Delete</button>}
        </div>
      )}
    </div>
  );
}