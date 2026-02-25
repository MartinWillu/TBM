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
        <div className="form-page-container">
            <h1 className="form-page-title">The Forbidden Fridge</h1>
            <div className="form-wrapper">
                <AuthForm onError={handleError} onSuccess={handleSubmit} submitLabel="Register" isRegister={true}>
                    <div>
                        <span className="form-toggle-text">Already have an account?</span>
                        <button
                            type="button"
                            className="form-link form-toggle-btn"
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