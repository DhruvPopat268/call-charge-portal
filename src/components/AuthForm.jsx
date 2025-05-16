import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';


const AuthForm = ({ mode, role }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false); // 🔁 state for toggle
  const isLogin = mode === "login";
  const navigate = useNavigate();

  useEffect(() => {
    reset();
  }, [mode,role, reset]);

  const onSubmit = async (data) => {
    try {
      localStorage.setItem("name",data.email)
      const endpoint = `http://localhost:7000/auth/${role}/${isLogin ? "login" : "signup"}`;
      const res = await axios.post(endpoint, data, {
        withCredentials: true,
      });

      console.log(res.data)

      if (isLogin) {
        if (res.data.user || res.data.admin) {
          const loggedInUser = res.data.user || res.data.admin;

          localStorage.setItem("adminId", loggedInUser._id);
          localStorage.setItem("role", role);
          console.log("Logging in as role:", role);  
        }
        navigate(`/${role}/dashboard`);
        toast.success("Login Successfully")
        
      } else {
        alert("Signup successful! Please login now.");
        navigate(`/auth?mode=login&role=${role}`);
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="w-full p-2 border rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", { required: "Password is required" })}
            className="w-full p-2 pr-10 border rounded"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-2 cursor-pointer text-gray-500"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {isLogin ? "Login" : "Signup"}
      </button>
    </form>
  );
};

export default AuthForm;