import { useEffect, useState } from "react";
import { decodeRole } from "../utils/jwtDecoder"
import type { UserRoleInfo } from "../types";
import { AdminUserComponent } from "../components/AdminUserComponent";
import { ChangeUserRole, GetUserRoleInfos } from "../api/adminApi";



export function AdminPage() {
    const [userRoleInfos, setUserRoleInfos] = useState<null | UserRoleInfo[]>(null);
    const role = decodeRole();

    const updateStoredInfo = () => {
        GetUserRoleInfos().then(res => {
            setUserRoleInfos(res);
            console.log(res);
        });
    }

    const handleRoleChange = (userId: number, role: string) => {
        ChangeUserRole(userId, role).then(() => {
            updateStoredInfo();
        })
    }

    useEffect(() => {
        updateStoredInfo();
    }, [])

    return (
        <>
            {role === "Admin" ? <h1>Welcome admin!</h1> : <h1>INTRUDER!</h1>}
            <ul>
                {userRoleInfos?.map(userInfo => {
                    return <li key={userInfo.id}>
                        <AdminUserComponent user={userInfo} onRoleChange={handleRoleChange} />
                    </li>
                })}
            </ul>
        </>
    )
}