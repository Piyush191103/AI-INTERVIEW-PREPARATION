import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const registerApi = async (formdata) => {
    const res = await axios.post(
      "http://localhost:5000/api/v1/user/register",
      formdata,
      { withCredentials: true }
    );
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      toast.success("Registered successfully!");
      navigate("/login");
    },
    onError: (error) => {
      console.log("Register Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong!");
    },
  });

  const registerFormHandler = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#0b1226] via-[#111c3d] to-[#0f172a] px-4 py-10 text-white">
      {/* background glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-600/25 blur-[110px]" />

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit(registerFormHandler)}
        className="relative w-full max-w-md space-y-5 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-slate-400">
            Start preparing for your next interview.
          </p>
        </div>

        {/* Full Name */}
        <div>
          <label className="mb-1.5 block text-sm text-slate-300">Full name</label>
          <div className="relative">
            <User
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Enter your name"
              className={inputClass}
              {...register("fullName", { required: "Name is required" })}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-400">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm text-slate-300">Email</label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              {...register("email", { required: "Email is required" })}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-sm text-slate-300">Password</label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              className={`${inputClass} pr-10`}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:opacity-90 disabled:opacity-60"
        >
          {mutation.isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Registering...
            </>
          ) : (
            "Register"
          )}
        </button>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-cyan-300 hover:underline">
            Login here
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Register;