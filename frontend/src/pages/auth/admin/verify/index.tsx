import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useAppStore } from "../../../../lib/zustand/store";

const SignUp: React.FC = () => {
  const { setUserData } = useAppStore();
  const navigate = useNavigate();
  const [verifyToken, setVerifyToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [successFlag, setSuccessFlag] = useState<boolean>(true);

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  useEffect(() => {
    const url = window.document.URL;
    const verify = url.split('?')[1].split('=')[1];
    const user_uuid = url.split('?')[2].split('=')[1];

    if (verify && user_uuid) {
      setVerifyToken(verify);
      setUserId(user_uuid);
    }

  },[window.document.URL]);

  useEffect(() => {
    if(userId && verifyToken) handelVerifySubmit();
  },[userId, verifyToken])

  const handelVerifySubmit = async () => {
    try {
      if(!verifyToken && !userId) throw new Error("Network response was not ok");

      // @ts-ignore
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/admin/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          verify: verifyToken,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.message || "Network response was not ok");
  
      setUserData(
        true,
        true,
        data.data.admin.email,
        data.data.admin.username,
        data.data.admin.contact_name_given,
        data.data.admin.contact_name_family,
        data.data.token,
        3600,
        new Date().getTime()
      );

      toast.success("Login successful! Redirecting...");
      await delay(2000);

      navigate("/admin");
    } catch (error) {
      toast.error("Verify failed. Please try again.");
      setSuccessFlag(false);
    }
  }

  const resendSubmit = async () => {
    try {
        if(!userId) throw new Error("Network response was not ok");
  
        // @ts-ignore
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/admin/resned`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        });
    
        const data = await response.json();
    
        if (!response.ok) throw new Error(data.message || "Network response was not ok");
    
        toast.success("Resend successfully!");
        await delay(2000);
        setSuccessFlag(true);
      } catch (error) {
        toast.error("Verify failed. Please try again.");
        setSuccessFlag(false);
      }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 font-nunito">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center flex justify-center flex-col">
          <img src="/logo.png" alt="RingCentral" className="w-48 mx-auto" />
          <div className="w-full border-b py-2" />
          <h2 className="my-6 text-2xl font-extrabold text-gray-900">
            Your account is being verified!
          </h2>
          {successFlag ? 
            <img src="/loading.gif" alt="loading" className="w-24 self-center"/>
            : <button
              onClick={resendSubmit}
              className="group relative flex justify-center py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Verify request send again
            </button>
          }
        </div>
        <div className="w-full border-b" />
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
