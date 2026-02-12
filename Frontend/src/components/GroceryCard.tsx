import type { Grocery } from "../types";


type Props = {
    grocery: Grocery;
}

export function GroceryCard({ grocery }: Props) {
      return (
    <div
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
    src={grocery.logoUrl}
    alt={grocery.name}
    style={{ width: "120px", height: "120px", objectFit: "contain" }}
    
    />

    <p style={{ marginTop: "10px", fontWeight: "bold" }}>
    {grocery.name}
    </p>
      
    {typeof grocery.currentPrice === "number" && (
    <p style={{ marginTop: 4, color: "#fefefe" }}>{"Price: " + grocery.currentPrice + " kr"}</p>)}
    {typeof grocery.quantity === "number" && ( <p style={{ marginTop: 4, color: "#fefefe" }}>{"Quantity: " + grocery.quantity}</p> )} </div> );

}