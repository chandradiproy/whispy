import { Contact, LogOut, MessageCirclePlus, MessageSquare, Settings, UserRoundPen } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
const Navbar = () => {
  const {authUser, logout} = useAuthStore();


  return (
    <header
      className="w-screen bg-base-100 
      border-base-300 border-b backdrop-blur-sm h-20 sticky top-0 z-40"
    >
      <nav className="h-full w-full flex items-center justify-between p-4">
        <Link to={"/"} className={"flex items-center gap-2"}>
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageCirclePlus className="w-5 h-5 text-primary" />
          </div>
          <div className="logo font-Nunito font-extrabold text-2xl">whispy</div>
        </Link>
        <div className="links flex justify-between ">
          <div className="flex gap-2">
            <Link
              to={"/settings"}
              className="btn btn-ghost btn-sm rounded-full"
            >
              <Settings />
              <span className="hidden md:inline">Settings</span>
            </Link>
            <a
              href={"https://www.linkedin.com/in/chandradiproy/"}
              target="_blank"
              className="btn btn-ghost btn-sm rounded-full"
            >
              <Contact />
              <span className="hidden md:inline">Contact Us</span>
            </a>
          </div>
          {authUser && (
            <div className="flex gap-2">
              <Link to={"/profile"} className="btn btn-ghost btn-sm rounded-full">
                <UserRoundPen className="w-5 h-5" />
                <span className="hidden md:inline">Profile</span>
              </Link>
              <button onClick={logout} className="btn btn-ghost btn-sm rounded-full">
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
