// src/pages/logout/Logout.jsx
import { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Logout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logout();
                navigate("/");
            } catch (error) {
                console.error("Logout failed:", error);
                navigate("/");
            }
        };
        performLogout();
    }, [logout, navigate]);

    return <div className="p-4">Logging out...</div>;
}

export default Logout;