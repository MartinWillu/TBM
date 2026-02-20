import { useState } from "react";
import { AuthForm } from "../components/AuthForm";
import type { UserInfo } from "../types";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router";
import "../components/Styles/LoginBoxStyle.css"

export function RegisterPage() {
    const [error, setError] = useState("");
    const navigator = useNavigate();

    const handleOnError = (message: string) => {
        setError(message)
    }

    const handleSubmit = (userInfo: UserInfo) => {
        registerUser(userInfo).then(() => {
            navigator("/login");
        }).catch((e: Error) => {
            setError(e.message);
        })
    }

    return (
        <>
            <h1>The Forbidden Fridge</h1>
            <h2>Register</h2>
            <AuthForm onError={handleOnError} onSuccess={handleSubmit} submitLabel="Create!" isRegister={true} />
            <a style={{ cursor: "pointer" }} onClick={() => navigator("/login")}><p>Already have an account?</p></a>
            {error ? <p className="error">{error}</p> : <></>}
        </>
    )
}