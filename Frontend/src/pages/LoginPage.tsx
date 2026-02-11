import { useNavigate } from "react-router"
import "../components/Styles/LoginBoxStyle.css"
import "../components/Styles/RegisterBoxStyle.css"
import { useState } from "react"
import { loginUser } from "../api/auth"
import type { UserInfo } from "../types"
import Box from "../components/Box"

export function LoginPage() {
    const navigator = useNavigate()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleClick = () => {
        if (!username.trim()) {
            setError("Username required!")
            return;
        }

        if (!password.trim()) {
            setError("Password is required!")
            return;
        }

        const userLogin = { username, password } as UserInfo;
        loginUser(userLogin).then(() => {
            navigator("/");
        }).catch(() => {
            setError("Invalid credentials");
            setTimeout(() => setError(""), 3000);
        })
    }

    const handleRegisterClick = () => {
        navigator("/register");
    }

    return (
        <>
            <h1>Login</h1>
            <h2>The forbidden fridge</h2>
            <Box onChange={(event) => { setUsername(event.target.value) }} type={"text"} placeholder={"Enter username"} />
            <Box onChange={(event) => { setPassword(event.target.value) }} type={"password"} placeholder={"Enter password"} />
            <button className="login-button" onClick={handleClick}>Login</button>
            <button className="register-button" onClick={handleRegisterClick}>Register</button>
            {error ? <p>{error}</p> : <></>}
        </>
    )
}