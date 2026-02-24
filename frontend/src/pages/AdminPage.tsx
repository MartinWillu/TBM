import { useEffect, useState } from "react";
import { decodeRole } from "../utils/jwtDecoder"
import type { UserRoleInfo } from "../types";
import { AdminUserComponent } from "../components/AdminUserComponent";
import { ChangeUserRole, GetUserRoleInfos } from "../api/adminApi";



export function AdminPage() {
    const [userRoleInfos, setUserRoleInfos] = useState<UserRoleInfo[]>([]);
    const [statusMsg, setStatusMsg] = useState("Change user roles:");
    const role = decodeRole();

    const updateStoredInfo = () => {
        GetUserRoleInfos().then(res => {
            setUserRoleInfos(res.sort((a, b) => a.id - b.id));
        });
    }

    const handleRoleChange = (userId: number, role: string) => {
        ChangeUserRole(userId, role).then(() => {
            updateStoredInfo();
            setStatusMsg(`Updated user ${userId} to ${role}!`);
        }).catch((e: Error) => {
            setStatusMsg(e.message);
        })
    }

    useEffect(() => {
        updateStoredInfo();
    }, [])

    return (
        <>
            {role === "Admin" ? <h1>Welcome admin!</h1> : <h1>INTRUDER!</h1>}
            {statusMsg && <p>{statusMsg}</p>}
            <ul>
                {userRoleInfos.map(userInfo => {
                    return <li key={userInfo.id}>
                        <AdminUserComponent user={userInfo} onRoleChange={handleRoleChange} />
                    </li>
                })}
            </ul>
        </>
    )
}