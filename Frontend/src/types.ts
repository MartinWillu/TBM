
export interface UserInfo {
    username: string,
    password: string,
}

export interface Category {
    id: number;
    name: string;
}

export interface Store {
    id: number;
    name: string;
    logoUrl: string;
    userId: number;
}

export interface Grocery {
    id: number;
    name: string;
    currentPrice: number;
    oldPrice: number;
    quantity: number;
    storeId: number;
    categoryId?: number;
    categories?: Category[];
}

export interface UserUpdate {
    username?: string;
    [key: string]: string | undefined;
}
