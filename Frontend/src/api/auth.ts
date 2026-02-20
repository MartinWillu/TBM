import type { UserInfo } from "../types";

export const registerUser = async (userInfo: UserInfo) => {
    const response = await fetch("api/auth/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInfo)
        }
    )
    if (!response.ok) {
        throw Error(await response.text())
    }
}

export const loginUser = async (userInfo: UserInfo) => {
    const response = await fetch("api/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInfo)
        }
    );
    const responseText = await response.text();
    if (!response.ok) {
        throw Error(responseText)
    }
    const token = responseText;
    localStorage.setItem("authToken", token);
}

export const logoutUser = async () => {
    localStorage.removeItem("authToken");
}

export const checkAuthorized = async () => {
    const token: string | null = localStorage.getItem("authToken");
    if (!token) {
        return false;
    }

    const response = await fetch("api/auth/verify", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return response.ok;
}