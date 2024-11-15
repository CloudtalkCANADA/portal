import React, { useRef, useState } from "react";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { base_url } from "../../../../config/setting";

// Password strength and validation check function
const evaluatePasswordStrength = (password: string) => {
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /[0-9]/.test(password),
    specialChar: /[@$!%*?&]/.test(password),
  };

  const strength = Object.values(criteria).filter(Boolean).length;

  let strengthLabel = "Weak";
  if (strength === 5) strengthLabel = "Strong";
  else if (strength >= 3) strengthLabel = "Moderate";

  return { strengthLabel, criteria, strength };
};

const SignUp: React.FC = () => {
  const ref = useRef<HTMLFormElement>(null);
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("Weak");
  const [passwordStrengthLevel, setPasswordStrengthLevel] = useState(0);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const { strengthLabel, strength } = evaluatePasswordStrength(newPassword);
    setPasswordStrength(strengthLabel);
    setPasswordStrengthLevel(strength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(ref.current as HTMLFormElement);
    const bodyData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(
        // @ts-ignore
        `${import.meta.env.VITE_API_URL}/auth/admin/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: bodyData.first_name,
            lastName: bodyData.last_name,
            username: bodyData.user_name,
            email: bodyData.email,
            password: bodyData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Network response was not ok");
      }

      toast.success(data.msg);
      setTimeout(() => {
        // Redirect to the signin page after 2 seconds
        window.location.href = "/admin/signin";
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 font-nunito">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <img src="/logo.png" alt="RingCentral" className="w-48 mx-auto" />
          <div className="w-full border-b py-2" />
          <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form ref={ref} className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="sr-only">
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="sr-only">
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="user_name" className="sr-only">
                User Name
              </label>
              <input
                id="user_name"
                name="user_name"
                type="text"
                autoComplete="given-name"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="User Name"
              />
            </div>
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
                autoComplete="new-password"
                required
                value={password}
                onChange={handlePasswordChange}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              {password && (
                <div className="mt-2 text-sm">
                  <div className="relative w-full h-2 rounded-full bg-gray-300">
                    <div
                      className="absolute top-0 left-0 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(passwordStrengthLevel / 5) * 100}%`,
                        backgroundColor:
                          passwordStrength === "Strong"
                            ? "green"
                            : passwordStrength === "Moderate"
                            ? "yellow"
                            : "red",
                      }}
                    />
                  </div>
                  <div
                    className={`mt-2 ${
                      passwordStrength === "Strong"
                        ? "text-green-600"
                        : passwordStrength === "Moderate"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    Password strength: {passwordStrength}
                  </div>
                </div>
              )}
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
              Sign up
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
            Already have an account?{" "}
            <Link
              to="/admin/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
