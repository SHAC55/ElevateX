import React from "react";
import { useAuth } from "../context/AuthContext";
import hero from "../assets/hero.png";

const WelcomeDisplay = () => {
  const { user } = useAuth();

  return (
    <div className="bg-[#E5DBFE] p-14 rounded-3xl shadow-sm grid grid-cols-1 md:grid-cols-2 items-center gap-12">
      
      {/* Text Section */}
      <div>
        <h1 className="text-5xl font-extrabold text-slate-900 leading-tight">
          Hi, <span className="text-violet-700">{user.username}</span> 👋
        </h1>

        <p className="mt-5 text-lg font-medium text-slate-700 max-w-xl">
          Ready to sharpen your skills, explore new ideas, and take your expertise
          to the next level?
        </p>
      </div>

      {/* Image Section */}
      {/* <div className="flex justify-center md:justify-end ">
        <img
          src={hero}
          alt="Learning illustration"
          className="w-100 lg:w-96 object-contain rounded-md"
        />
      </div> */}

    </div>
  );
};

export default WelcomeDisplay;
