import { useState } from "react";
import { RegisterForm } from "../components/RegisterForm";
import type { UserInfo } from "../types";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router";

export function RegisterPage() {
    const [error, setError] = useState("");
    const navigator = useNavigate();

    const handleOnError = (message: string) => {
        setError(message)
    }

    const handleSubmit = (userInfo: UserInfo) => {
        registerUser(userInfo).then(() => {
            navigator("/login");
        }).catch(() => {
            setError("Register request failed!")
        })
    }

    return (
        <>
            <h1>Register</h1>
            <RegisterForm onError={handleOnError} onSucess={handleSubmit} ></RegisterForm>
            <p>{error}</p>
        </>
    )
}