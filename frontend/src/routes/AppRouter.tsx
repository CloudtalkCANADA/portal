import React from "react";
import { RouterProvider, createBrowserRouter, } from "react-router-dom";

import {
  AdminDashboard,
  DomainsDashboard,
  ExtensionsDashboard,
  UsersDashboard,
} from "../pages/admin";
import SignIn from "../pages/auth/admin/signIn";
import SignUp from "../pages/auth/admin/signUp";
import Verify from "../pages/auth/admin/verify";
import { default as CustomerSignIn } from "../pages/auth/customer/signIn";
import { default as CustomerSignUp } from "../pages/auth/customer/signUp";
import { CustomerDashboard } from "../pages/customer";

import ProtectedRoute from "./ProtectedRoute";

const AppRouter: React.FC = () => {
  const routesForPublic = [
    {
      path: "/customer/signin",
      element: <CustomerSignIn />,
    },
    {
      path: "/customer/signup",
      element: <CustomerSignUp />,
    },
    {
      path: "/admin/signin",
      element: <SignIn />,
    },
    {
      path: "/admin/signup",
      element: <SignUp />,
    },
    {
      path: "/admin/verify",
      element: <Verify />,
    },
  ];

  const routersForAdminAuthenticatedOnly = [
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/admin",
          element: <AdminDashboard />,
        },
        {
          path: "/admin/domains/default",
          element: <DomainsDashboard />,
        },
        {
          path: "/admin/extensions/default",
          element: <ExtensionsDashboard />,
        },
        {
          path: "/admin/users/default",
          element: <UsersDashboard />,
        },
      ],
    },
  ];

  const routersForCustomerAuthenticatedOnly = [
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/customer",
          element: <AdminDashboard />,
        },
        {
          path: "/customer/domains/default",
          element: <DomainsDashboard />,
        },
        {
          path: "/customer/extensions/default",
          element: <ExtensionsDashboard />,
        },
        {
          path: "/customer/users/default",
          element: <UsersDashboard />,
        },
      ],
    },
  ];

  const router = createBrowserRouter([
    ...routesForPublic,
    ...routersForAdminAuthenticatedOnly,
    ...routersForCustomerAuthenticatedOnly,
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
