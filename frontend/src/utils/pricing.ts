import type { Grocery } from "../types";

export function isOnSale(g: Grocery): boolean {
    return (
        typeof g.oldPrice === "number" && 
        typeof g.currentPrice === "number" &&
        g.currentPrice < g.oldPrice
    );
}

export function formatCurrency(value: number, currency: string = "USD", locale = "en-US")
{
    return new Intl.NumberFormat(locale, {style: "currency", currency}).format(value);
}