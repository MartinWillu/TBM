import type { Grocery, Store } from "../types";
import { CreateAuthRequest } from "./auth";

export type CreateStorePayload = {
  name: string;
  logoUrl?: string;
};

export type CreateGroceryPayload = {
  name: string;
  currentPrice: number;
  oldPrice: number;
  quantity: number;
  imageUrl?: string;
  storeId: number;
  categoryId: number;
};

export async function createStore(payload: CreateStorePayload): Promise<Store> {
  const authReq = CreateAuthRequest({ method: "POST" });
  if (!authReq) {
    throw new Error("Missing JWT token in storage!");
  }
  authReq.headers = {
    ...authReq.headers,
    "Content-Type": "application/json",
  };
  authReq.body = JSON.stringify(payload);

  const response = await fetch("api/store", authReq);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return (await response.json()) as Store;
}

export async function createGrocery(
  payload: CreateGroceryPayload
): Promise<Grocery> {
  const authReq = CreateAuthRequest({ method: "POST" });
  if (!authReq) {
    throw new Error("Missing JWT token in storage!");
  }
  authReq.headers = {
    ...authReq.headers,
    "Content-Type": "application/json",
  };
  authReq.body = JSON.stringify(payload);

  const response = await fetch("api/grocery", authReq);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return (await response.json()) as Grocery;
}
