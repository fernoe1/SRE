import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuthContext();

    if (loading) return null; 

    if (!user) return <Navigate to="/signin" />;

    return children; 
};

export default ProtectedRoute;
