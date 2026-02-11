import { useEffect } from "react"
import { checkAuthorized } from "../api/auth"
import { Outlet, useNavigate } from "react-router"


export const ProtectedRoute = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const isAuthorized = await checkAuthorized()
            if (!isAuthorized) {
                navigate("/login");
                return
            }
        }
        verifyToken();
    }, [navigate])

    return <Outlet />
}