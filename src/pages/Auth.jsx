import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useForm } from "react-hook-form";

const Auth = () => {
  const {reset} = useForm()
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const mode = query.get("mode") || "login"; // login or signup
  const role = query.get("role") || "user";   // user or admin

  const toggleMode = () => {
    navigate(`/auth?mode=${mode === "login" ? "signup" : "login"}&role=${role}`);
   
  };

  const toggleRole = () => {
    navigate(`/auth?mode=${mode}&role=${role === "user" ? "admin" : "user"}`);
 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center capitalize">
          {mode} as {role}
        </h2>

        <AuthForm mode={mode} role={role} />

        <div className="mt-4 text-center text-sm">
          <button onClick={toggleMode} className="text-blue-600 hover:underline">
            Switch to {mode === "login" ? "Signup" : "Login"}
          </button>
          {" | "}
          <button onClick={toggleRole} className="text-blue-600 hover:underline">
            Switch to {role === "user" ? "Admin" : "User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;