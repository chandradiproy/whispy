import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
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
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();
  const validateForm = () => {
    if(!formData.fullName.trim()){
        return toast.error("Full name is required !");
    }
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
  const ValidatePassword = (e)=>{
    const password = e.target.value.trim();
    const label = document.querySelector(".cPassError");
    const btn = document.querySelector(".btn");
   
    if(password !== formData.password){
        label.classList.remove("hidden");
        label.classList.add("block");
    }else{
        label.classList.remove("block");
        label.classList.add("hidden");
    }
    if(label.classList.contains("hidden")){
        btn.disabled = false;
    }else{
        btn.disabled = true;

    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if(isValid){
        signup(formData);
    }
  };
  return (
    <div className="flex  justify-center sm:pt-5 pt-1 min-h-screen ">
      <main className="sm:h-full h-fit grid lg:grid-cols-2  w-[80vw]">
        {/* Left Section Start */}

        <aside className=" h-full flex flex-col justify-center gap-y-7 items-center rounded-lg">
          <AuthImagePattern
            title="Welcome to Whisp!"
            subtitle="Effortless chatting, redefined. Whisp brings you closer to the people who matter most, with a sleek and simple interface designed for meaningful conversations. Join the community today and start whispering your thoughts to the world!"
          />
        </aside>

        {/* Left Section Ends */}

        {/* Right Section Starts */}
        <section className="bg-base-300 flex items-center justify-center h-full sm:h-full rounded-lg p-4">
          <div className="w-full p-4 flex flex-col gap-y-4">
            <div className="flex flex-col items-center gap-1 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                 group-hover:bg-primary/20 transition-colors"
              >
                <UserRoundPlus className="sm:size-7 size-[6vw] text-primary " />
              </div>
              <h1 className="sm:text-2xl text-[5vw] font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60 sm:text-xl text-[4vw]">
                Get started with your free account
              </p>
            </div>
            <div className="form-div w-full max-h-fit">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium ">Full Name</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type="text"
                      className={`input input-bordered w-full pl-10`}
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </div>
                </div>

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

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Confirm Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`input input-bordered w-full pl-10`}
                      placeholder="••••••••"
                      onInput={ValidatePassword}
                      
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
                <label className="cPassError text-red-700 text-sm hidden">Password does not match</label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full text-lg "
                  disabled={isSigningUp}
                >
                  {isSigningUp ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
              <div className="text-center mt-2 ">
                <p className="text-base-content/60">
                  Already have an account?{" "}
                  <Link to="/login" className="underline text-primary">
                    Sign in
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
