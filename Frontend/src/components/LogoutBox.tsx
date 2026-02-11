
import { useNavigate } from "react-router";
import { logoutUser } from "../api/auth";



function LogoutBox() {

    const navigator = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigator("/login");
        console.log("Logged out");
    };

    return (

        <button className="logout-button" onClick={handleLogout}> Log Out</button>

    );
}

export default LogoutBox;