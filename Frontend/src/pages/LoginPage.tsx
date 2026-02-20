import { useNavigate } from "react-router"
import { useState } from "react"
import { loginUser } from "../api/auth"
import type { UserInfo } from "../types"
import { AuthForm } from "../components/AuthForm"
import "../components/Styles/RegisterBoxStyle.css"

export function LoginPage() {
    const navigator = useNavigate()
    const [error, setError] = useState("");

    const handleLogin = (userInfo: UserInfo) => {
        loginUser(userInfo).then(() => {
            navigator("/");
        }).catch(() => {
            setError("Invalid credentials");
            setTimeout(() => setError(""), 3000);
        })
    }

    const handleRegisterClick = () => {
        navigator("/register");
    }

    const handleOnError = (message: string) => {
        setError(message);
    }

    return (
        <>
            <h1>The Forbidden Fridge</h1>
            <h2>Login</h2>
            <AuthForm
                onError={handleOnError}
                onSuccess={handleLogin}
                submitLabel="Login"
            >
                <button type="button" className="register-button" onClick={handleRegisterClick}>Register</button>
            </AuthForm>
            {error ? <p className="error">{error}</p> : <></>}
        </>
    )
}