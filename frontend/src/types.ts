
export interface UserInfo {
    username: string;
    password: string;
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
    groceriyId: number;
    groceries: Grocery[];
}

export interface Grocery {
    logoUrl: string | undefined;
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

export const Role = {
    Admin: "Admin",
    User: "User",
    StoreOwner: "StoreOwner",
} as const;
export type Role = typeof Role[keyof typeof Role];

export interface JwtTokenClaims {
    sub: string,
    name: string,
    jti: string
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": Role,
    exp: number,
    iss: string,
    aud: string,
}