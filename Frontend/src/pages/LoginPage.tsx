import { useNavigate } from "react-router"

export function LoginPage() {
    const navigator = useNavigate()

    const handleClick = () => {
        navigator("/");
    }

    return (
        <>
            <h1>Login</h1>
            <button onClick={handleClick}>CLICK ME</button>
        </>
    )
}