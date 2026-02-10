import { useNavigate } from "react-router"
import PasswordBox from "../components/PasswordBox"
import UsernameBox from "../components/UserNameBox"
import "../components/Styles/LoginBoxStyle.css"
import "../components/Styles/RegisterBoxStyle.css"

export function LoginPage() {
    const navigator = useNavigate()

    const handleClick = () => {
        navigator("/");
    }

    const handleRegisterClick = () => {
        navigator("/register");
    }

    return (
        <>
            <h1>Login</h1>
            <h2>The forbidden fridge</h2>
            <UsernameBox />
            <PasswordBox />
            <button className="login-button" onClick={handleClick}>Login</button>
            <button className="register-button" onClick={handleRegisterClick}>Register</button>
        </>
    )
}