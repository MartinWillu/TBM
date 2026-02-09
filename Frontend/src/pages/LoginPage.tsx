import { useNavigate } from "react-router"
import PasswordBox from "../components/PasswordBox"
import UsernameBox from "../components/UserNameBox"

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
            <UsernameBox />
            <PasswordBox />
            <button onClick={handleClick}>Login</button>
            <button onClick={handleRegisterClick}>Register</button>
        </>
    )
}