import { useState } from "react";
import type { UserInfo } from "../types";
import "./Styles/Form.css";

interface AuthFormProps {
    onError(message: string): void;
    onSuccess(userInfo: UserInfo): void;
    submitLabel?: string;
    children?: React.ReactNode;
    isRegister?: boolean;
}

export function AuthForm({ onError, onSuccess, submitLabel = "Submit", children, isRegister }: AuthFormProps) {
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
        <form onSubmit={handleSubmit} className="form-container">
            <h2 className="form-title">{submitLabel}</h2>
            <div className="form-input-group">
                <input
                    className="form-input"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value.trim())}
                />
                <input
                    className="form-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value.trim())}
                />
            </div>

            <button type="submit" className="form-button">{submitLabel}</button>

            {children && (
                <div style={{ marginTop: '16px', width: '100%', textAlign: 'center' }}>
                    {children}
                </div>
            )}
        </form>
    )
}