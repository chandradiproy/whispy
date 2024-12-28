import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  User,
  UserRoundPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();
  const validateForm = () => {
    if(!formData.email.trim()){
        return toast.error("Email is required !");
    }
    if(!/\S+@\S+.\S+/.test(formData.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/ .test(formData.email)){
        toast.error("Invalid email address format!");
    }
    if(!formData.password.trim()){
        return toast.error("Password is required !");
    }
    if(formData.password.length < 6){
        return toast.error("Password must be at least 6 characters long");
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if(isValid){
        login(formData);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-[100vh]">
      <main className="min-h-[80vh] grid lg:grid-cols-2 shadow-xl w-[80vw]  mt-10">
        {/* Left Section Start */}

        <aside className="min-w-full h-full flex flex-col justify-center gap-y-7 items-center rounded-lg">
          <AuthImagePattern
            title="Welcome to Back!"
            subtitle="Your World of Instant Communication Awaits."
          />
        </aside>

        {/* Left Section Ends */}

        {/* Right Section Starts */}
        <section className="bg-base-300 flex items-center justify-center rounded-lg  min-h-[80vh]">
          <div className="w-full p-4 flex flex-col gap-y-4">
            <div className="flex flex-col items-center gap-1 group">
              <div
                className="size-12 rounded-xl bg-primary/20 flex items-center justify-center 
                 group-hover:bg-primary/20 transition-colors"
              >
                <LogIn className="size-7 text-primary " />
              </div>
              <h1 className="sm:text-2xl text-[5vw] font-bold mt-2">Log In</h1>
              <p className="text-base-content/60 sm:text-xl text-[4vw] text-primary text-center">
                Get back to your account. Your connections are waiting!
              </p>
            </div>
            <div className="form-div w-full max-h-fit">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type="email"
                      className={`input input-bordered w-full pl-10`}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`input input-bordered w-full pl-10`}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5 text-base-content/40" />
                      ) : (
                        <Eye className="size-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-full text-lg "
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Log In"
                  )}
                </button>
              </form>
              <div className="text-center mt-2">
                <p className="text-base-content/60">
                  Don't have an account?{" "}
                  <Link to="/signup" className="underline text-primary">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Right Section Ends */}
      </main>
    </div>
  );
};
export default SignUpPage;
