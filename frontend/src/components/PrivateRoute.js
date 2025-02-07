import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();

    console.log("🔒 `PrivateRoute` の `user`: ", user);

    if(!user){
      return <Navigate to="/login" />;
    }
  return children || <Outlet />;
};

export default PrivateRoute;
