import type { Store } from "../types";


export async function fetchStores(): Promise<Store[]> {
    const response = await fetch("backend/api/store");
    if (!response.ok) {
        throw Error("Fetch all stores request failed!");
    }
    const stores = await response.json() as Store[]
    return stores;
}