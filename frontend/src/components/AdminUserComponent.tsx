import type { UserRoleInfo } from "../types";

interface AdminUserComponentPros {
    user: UserRoleInfo,
    onRoleChange(userId: number, role: string): void;
}

export function AdminUserComponent({ user, onRoleChange }: AdminUserComponentPros) {
    return (
        <>
            <p>{user.id} | {user.username}</p>
            <select name="selectedRole" defaultValue={user.role} onChange={(e) => onRoleChange(user.id, e.target.value)}>
                <option value="Admin">Admin</option>
                <option value="StoreOwner">Store Owner</option>
                <option value="User">User</option>
            </select>
        </>
    )
}