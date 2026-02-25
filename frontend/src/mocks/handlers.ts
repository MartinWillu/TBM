import { http, HttpResponse } from "msw";
import { type Category, type Store, type Grocery, type UserUpdate } from "../types"
import categoriesData from "./data/categories.json";
import storesData from "./data/stores.json";
import groceriesData from "./data/groceries.json";

const mockCategories: Category[] = categoriesData as Category[];
const mockStores: Store[] = storesData as Store[];
const mockGroceries: Grocery[] = groceriesData as Grocery[];

export const handlers = [
    http.get('api/auth/verify', async () => {
        return new HttpResponse("Authorized", { status: 200 })
    }),

    http.post('api/auth/register', async () => {
        return new HttpResponse("created user with username: testuser", { status: 201 });
    }),

    http.post('api/auth/login', async () => {
        return new HttpResponse("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5IiwibmFtZSI6ImplZmY1OCIsImp0aSI6IjRjZjRhOTE2LWY3YzQtNDE4MC1hYWY3LWI1MzMyYTkwNWFkZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NzE5MjMxOTMsImlzcyI6ImxvY2FsaG9zdCIsImF1ZCI6ImxvY2FsaG9zdCJ9.EnO81ImnqKLHYjGU6iE65MkxDJ9dTlA7OU8zisWikIc", { status: 200 });
    }),

    http.get('api/Category', () => {
        return HttpResponse.json(mockCategories);
    }),

    http.get('api/Category/:id', ({ params }) => {
        const { id } = params;
        const category = mockCategories.find(c => c.id === Number(id));
        if (!category) {
            return new HttpResponse("Category not found", { status: 404 });
        }
        return HttpResponse.json(category);
    }),

    http.post('api/Category', async () => {
        return new HttpResponse("Category created", { status: 201 });
    }),

    http.put('api/Category/:id', async () => {
        return new HttpResponse("Category updated", { status: 200 });
    }),

    http.delete('api/Category/:id', async () => {
        return new HttpResponse("Category deleted", { status: 200 });
    }),

    http.get('api/Grocery', () => {
        return HttpResponse.json(mockGroceries);
    }),

    http.get('api/Store', () => {
        mockStores.map((store, index) => {
            store.groceriyId = index;
            store.groceries = groceriesData;
        })
        return HttpResponse.json(mockStores);
    }),

    http.get('api/Store/:id', ({ params }) => {
        const { id } = params;
        const store = mockStores.find(s => s.id === Number(id));
        if (!store) {
            return new HttpResponse("Store not found", { status: 404 });
        }
        return HttpResponse.json(store);
    }),

    http.post('api/Store', async ({ request }) => {
        const newStore = await request.json() as Store;
        newStore.id = Math.max(...mockStores.map(s => s.id)) + 1;
        return HttpResponse.json(newStore, { status: 401 });
    }),

    http.put('api/Store/:id', async ({ params, request }) => {
        const { id } = params;
        const storeIndex = mockStores.findIndex(s => s.id === Number(id));
        if (storeIndex === -1) {
            return new HttpResponse("Store not found", { status: 404 });
        }
        const updates = await request.json() as Store;
        return HttpResponse.json({ ...mockStores[storeIndex], ...updates });
    }),

    http.delete('api/Store/:id', ({ params }) => {
        return new HttpResponse("Deleted store with id: " + params.id, { status: 200 });
    }),

    http.put('api/User', async ({ request }) => {
        const updates = await request.json() as UserUpdate;
        return HttpResponse.json({
            id: 1,
            username: updates.username,
            role: "User"
        });
    }),

    http.delete('api/User', () => {
        return new HttpResponse("Deleted user account", { status: 200 });
    })
];