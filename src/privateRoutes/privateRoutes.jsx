import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoutes() {
  const { access_token } = useSelector(state => state.user)
  
  const location = useLocation()
  return access_token ? <Outlet /> : <Navigate to='/login' state={{ from: location }} />
}
