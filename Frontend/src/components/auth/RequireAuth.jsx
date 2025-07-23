import { useAuth } from "../../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const { usuario, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  return usuario ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;