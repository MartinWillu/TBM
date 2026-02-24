import type { UserRoleInfo } from "../types";
import "./Styles/AdminUserComponent.css";

interface AdminUserComponentPros {
    user: UserRoleInfo,
    onRoleChange(userId: number, role: string): void;
}

export function AdminUserComponent({ user, onRoleChange }: AdminUserComponentPros) {
    return (
        <div className="admin-user-container">
            <div className="admin-user-username">{user.username}</div>
            <div className="admin-user-id">ID: {user.id}</div>

            <label className="admin-role-label">
                Role:
                <select
                    className="admin-role-select"
                    value={user.role}
                    onChange={(e) => onRoleChange(user.id, e.target.value)}
                >
                    <option value="Admin">Admin</option>
                    <option value="StoreOwner">Store Owner</option>
                    <option value="User">User</option>
                </select>
            </label>
        </div>
    )
}