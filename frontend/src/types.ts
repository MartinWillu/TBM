
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
    imageUrl: string | undefined;
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

export const Roles = {
    Admin: "Admin",
    User: "User",
    StoreOwner: "StoreOwner",
} as const;
export type Role = typeof Roles[keyof typeof Roles];

export interface JwtTokenClaims {
    sub: string,
    name: string,
    jti: string
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": Role,
    exp: number,
    iss: string,
    aud: string,
}

export interface UserRoleInfo {
    id: number,
    username: string,
    role: Role
}

export const Themes = {
    Dark: "dark",
    Light: "light",
} as const;

export type Theme = typeof Themes[keyof typeof Themes];