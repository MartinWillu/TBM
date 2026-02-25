import { useState } from "react";
import { AuthForm } from "../components/AuthForm";
import type { UserInfo } from "../types";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router";

export function RegisterPage() {
    const [error, setError] = useState("");
    const navigator = useNavigate();

    const handleError = (message: string) => {
        setError(message)
        setTimeout(() => setError(""), 3000);
    }

    const handleSubmit = (userInfo: UserInfo) => {
        setError("");
        registerUser(userInfo).then(() => {
            navigator("/login");
        }).catch((e: Error) => {
            setError(e.message);
            setTimeout(() => setError(""), 3000);
        })
    }

    return (
        <div className="flex-center" style={{ flexDirection: 'column', minHeight: '80vh' }}>
            <h1 className="text-center" style={{ margin: 'var(--spacing-lg) 0' }}>The Forbidden Fridge</h1>
            <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                <AuthForm onError={handleError} onSuccess={handleSubmit} submitLabel="Register" isRegister={true}>
                    <div>
                        <span style={{ opacity: 0.7, marginRight: '8px' }}>Already have an account?</span>
                        <button
                            type="button"
                            className="form-link"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
                            onClick={() => navigator("/login")}
                        >
                            Login
                        </button>
                    </div>
                </AuthForm>
                <p className={`form-error-message ${error ? 'visible' : ''}`}>{error}</p>
            </div>
        </div>
    )
}