import React, { useCallback, useEffect, useRef } from "react";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppStore } from "../../../../lib/zustand/store";

import { base_url } from "../../../../config/setting";

const SignIn: React.FC = () => {
  const { setUserData, userData } = useAppStore();
  const ref = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const checkLoggedIn = useCallback(async () => {
    if (userData.isAuthenticated) {
      navigate("/admin");
    }
  }, [userData.isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(ref.current as HTMLFormElement);
    const bodyData = Object.fromEntries(formData.entries());

    try {
      // @ts-ignore
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: bodyData.email,
          password: bodyData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Network response was not ok");
      }

      toast.success("Login successful! Redirecting...");
      await delay(2000);
      setUserData(
        true,
        true,
        bodyData.email as string,
        data.data.admin.username,
        data.data.admin.contact_name_given,
        data.data.admin.contact_name_family,
        data.data.token,
        3600,
        new Date().getTime()
      );
      navigate("/admin");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 font-nunito">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <img src="/logo.png" alt="CloudTalk" className="w-48 mx-auto" />
          <div className="w-full border-b py-2" />
          <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
            Sign in
          </h2>
        </div>
        <form ref={ref} className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember_me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>

          <div className="flex items-center justify-center space-x-4 mt-6">
            <button
              type="button"
              className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100"
            >
              <FcGoogle className="text-xl" />
              <span className="ml-2">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100"
            >
              <FaApple className="text-2xl" />
              <span className="ml-2">Apple</span>
            </button>
          </div>
        </form>
        <div className="w-full border-b py-2" />
        <div>
          <p className="text-sm text-center text-gray-600">
            <Link
              to="/customer/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Go to client
            </Link>
            &nbsp; Or &nbsp;
            <Link
              to="/admin/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignIn;
