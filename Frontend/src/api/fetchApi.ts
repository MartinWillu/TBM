import type { Grocery, Store } from "../types";


export async function fetchStores(): Promise<Store[]> {
    const response = await fetch("api/store");
    if (!response.ok) {
        throw Error("Fetch all stores request failed!");
    }
    const stores = await response.json() as Store[]
    return stores;
}

export async function fetchGroceries(): Promise<Grocery[]> {
    const response = await fetch("api/grocery");
    if (!response.ok) {
        throw Error("Fetch all stores request failed!");
    }
    const groceries = await response.json() as Grocery[]
    return groceries;
}