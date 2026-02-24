import { Role, type JwtTokenClaims } from "../types";

function decodeJwtPayload(token: string): JwtTokenClaims | null {
    const parts = token.split(".");
    if (parts.length < 2) {
        return null;
    }

    try {
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(
            base64.length + ((4 - (base64.length % 4)) % 4),
            "="
        );
        const json = atob(padded);
        return JSON.parse(json) as JwtTokenClaims;
    } catch {
        return null;
    }
}

export function decodeJwt(): JwtTokenClaims | null {
    const token = localStorage.getItem("authToken");
    if (!token) {
        return null;
    }
    const payload = decodeJwtPayload(token);
    if (!payload) {
        return null;
    }
    return payload;
}

export function decodeRole(): Role | null {
    const payload = decodeJwt();
    return payload ? payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null;
}