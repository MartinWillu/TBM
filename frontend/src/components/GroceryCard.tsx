import type { Grocery } from "../types";
import { isOnSale, formatCurrency } from "../utils/pricing";

type Props = {
  grocery: Grocery;
  onClick?: () => void;    
  className?: string;      
};

export function GroceryCard({ grocery, onClick, className }: Props) {
  const sale = isOnSale(grocery);
  const hasImage = Boolean(grocery.logoUrl);

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
      className={`flex-item ${sale ? "is-sale" : ""} ${className ?? ""}`}
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        borderRadius: "8px",
        width: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: onClick ? "pointer" : "default",
        backgroundColor: "#4a4343",
        outline: "none",
      }}
      aria-label={`${grocery.name}${sale ? " (On sale)" : ""}`}
    >
      {hasImage && (
        <img
          className="flex-item__image"
          src={grocery.logoUrl!}
          alt={`${grocery.name} logo`}
          style={{ width: "120px", height: "120px", objectFit: "contain" }}
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
      )}

      <h3 style={{ marginTop: 10, fontWeight: "bold", color: "#fefefe" }}>
        {grocery.name}
      </h3>

      {sale ? (
        <p
          style={{ marginTop: 4, color: "#fefefe", textAlign: "center" }}
          aria-label={`On sale. Now ${currentPriceLabel}${
            oldPriceLabel ? `, was ${oldPriceLabel}` : ""
          }`}
        >
          <span className="price price--current">{currentPriceLabel}</span>{" "}
          {oldPriceLabel && (
            <span className="price price--old" aria-hidden="true">
              {oldPriceLabel}
            </span>
          )}
          <br />
          Quantity: {grocery.quantity}
        </p>
      ) : (
        <p style={{ marginTop: 4, color: "#fefefe", textAlign: "center" }}>
          Current price: {currentPriceLabel}
          <br />
          Quantity: {grocery.quantity}
        </p>
      )}
    </div>
  );
}