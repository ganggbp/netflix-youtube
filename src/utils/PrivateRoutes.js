import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { selectUser } from "../features/userSlice";

const PrivateRoutes = () => {
  const user = useSelector(selectUser);

  if (!user?.uid) {
    return <Navigate to='/login' />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
