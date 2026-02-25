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

    if (role !== "Admin") {
        return (
            <div className="container flex-center" style={{ flexDirection: 'column', height: '50vh' }}>
                <h1 style={{ color: 'var(--error-color)' }}>INTRUDER!</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        )
    }

    return (
        <div className="container">
            <h1>Admin Dashboard</h1>
            {statusMsg && <p className="text-center" style={{ marginBottom: 'var(--spacing-md)', color: 'var(--secondary-color)' }}>{statusMsg}</p>}

            <div className="card-grid">
                {userRoleInfos.map(userInfo => (
                    <div key={userInfo.id} className="card" style={{ padding: 'var(--spacing-md)', minHeight: 'auto', width: '100%', maxWidth: '300px' }}>
                        <AdminUserComponent user={userInfo} onRoleChange={(id, role) => handleRoleChange(id, role)} />
                    </div>
                ))}
            </div>
        </div>
    )
}