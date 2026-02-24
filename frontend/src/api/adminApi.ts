import type { UserRoleInfo } from "../types";
import { CreateAuthRequest } from "./auth"

export const ChangeUserRole = async (userId: number, role: string) => {
    const authReq = CreateAuthRequest({ method: "PATCH" });
    if (!authReq) {
        throw Error("JWT not found in storage!");
    }
    await fetch(`api/user/${userId}?role=${role}`, authReq);
    console.log("Updated role");
}

export const GetUserRoleInfos = async (): Promise<UserRoleInfo[]> => {
    const authReq = CreateAuthRequest({ method: "GET" });
    if (!authReq) {
        throw Error("Missing JWT token in storage!");
    }

    const response = await fetch("api/user", authReq);
    if (!response.ok) {
        throw Error("Fetch user infos failed!");
    }
    return await response.json() as UserRoleInfo[];
}