import { useNavigate } from "react-router"
import { useState } from "react"
import { loginUser } from "../api/auth"
import type { UserInfo } from "../types"
import { AuthForm } from "../components/AuthForm"

const LoginPage: React.FC = () => {
    const navigator = useNavigate()
    const [error, setError] = useState("");

    const handleLogin = (userInfo: UserInfo) => {
        setError("");
        loginUser(userInfo).then(() => {
            navigator("/");
        }).catch(() => {
            handleOnError("Invalid credentials");
        })
    }

    const handleRegisterClick = () => {
        navigator("/register");
    }

    const handleOnError = (message: string) => {
        setError(message);
        setTimeout(() => setError(""), 3000);
    }

    return (
        <div className="flex-center" style={{ flexDirection: 'column', minHeight: '80vh' }}>
            <h1 className="text-center" style={{ margin: 'var(--spacing-lg) 0' }}>The Forbidden Fridge</h1>
            <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                <AuthForm
                    onError={handleOnError}
                    onSuccess={handleLogin}
                    submitLabel="Login"
                >
                    <div>
                        <span style={{ opacity: 0.7, marginRight: '8px' }}>Don't have an account?</span>
                        <button
                            type="button"
                            className="form-link"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
                            onClick={handleRegisterClick}
                        >
                            Register
                        </button>
                    </div>
                </AuthForm>
                <p className={`form-error-message ${error ? 'visible' : ''}`}>{error}</p>
            </div>
        </div>
    )
}

export { LoginPage };