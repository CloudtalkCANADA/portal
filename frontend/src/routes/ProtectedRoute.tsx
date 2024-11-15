import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAppStore } from "../lib/zustand/store";

export interface IProtectedRoute {}

const ProtectedRoute: React.FC<IProtectedRoute> = () => {
  const { userData, setUserData } = useAppStore();

  if (window.location.pathname === '/' && userData.isAuthenticated && userData.token) {
    return userData.isAdmin ? 
      (<>
        <Navigate to="/admin" />
        <Outlet />
      </>) : 
      (<>
        <Navigate to="/customer" />
        <Outlet />
      </>);
  }

  // if (window.location.pathname.includes('admin') && userData.isAuthenticated && userData.token) {
  //   if (!userData.isAdmin)
  //     setUserData(false, false, "", "", "", " ", "", 0, 0);
  //     return (<>
  //       <Navigate to="/customer/signin" />
  //     </>);
  // }

  if (userData.token === "") return <Navigate to="/customer/signin" />;

  if (userData.loginTime + userData.expireTime * 1000 < new Date().getTime()) {
    setUserData(false, false, "", "", "", " ", "", 0, 0);

    return <Navigate to="/customer/signin" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
