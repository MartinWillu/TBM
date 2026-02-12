import { useEffect, useState } from "react"
import { checkAuthorized } from "../api/auth"
import { Outlet, useNavigate } from "react-router"


export const ProtectedRoute = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const isAuthorized = await checkAuthorized()
            if (!isAuthorized) {
                navigate("/login");
            }
            setIsLoading(false);
        }
        verifyToken();
    }, [navigate])

    if (isLoading) {
        return null;
    }

    return <Outlet />
}