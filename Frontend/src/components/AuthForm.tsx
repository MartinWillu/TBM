import { useState } from "react";
import type { UserInfo } from "../types";
import "./Styles/BoxStyle.css"
import "./Styles/LoginBoxStyle.css"

interface AuthFormProps {
    onError(message: string): void;
    onSuccess(userInfo: UserInfo): void;
    submitLabel?: string;
    children?: React.ReactNode;
    isRegister?: boolean;
}

export function AuthForm({ onError, onSuccess, submitLabel = "Submit", children, isRegister = false }: AuthFormProps) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!username) {
            onError("Username is required!");
            return;
        }

        if (!password) {
            onError("Password is required!");
            return;
        }

        if (isRegister && password.length < 6) {
            onError("Minimum password length is 6 characters!");
            return;
        }

        onSuccess({ username, password } as UserInfo)
    }

    return (
        <form onSubmit={handleSubmit} className="input-box">
            <input type="text" placeholder="Username" onChange={(event) => setUsername(event.target.value.trim())} />
            <input type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value.trim())} />
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <button type="submit" className="login-button">{submitLabel}</button>
                {children}
            </div>
        </form>
    )
}