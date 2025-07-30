import React from "react";
import MegaprjDash from "../Components/MegaprjDash";
import Skillsdash from "../Components/Skillsdash";
import Certificate from "../Components/Certificate";

const HomePage = () => {
  const miniDash = [
    { Tag: "Skills Completed", logo: "", Num: "8" },
    { Tag: "Skills In Progress", logo: "", Num: "4" },
    { Tag: "Mini Projects", logo: "", Num: "2" },
    { Tag: "ATS Resume Score", logo: "", Num: "80" },
  ];
  return (
    <div className="w-full p-6 h-[910px] overflow-y-scroll">
      {/* WELCOME_ */}
      <h1 className="text-3xl font-semibold">Welcome back, USER !</h1>
      {/* CURRENT_GOAL */}
      <div className="flex mt-6 items-center">
        <h3 className="text-xl font-medium">Current Goal :</h3>
        <p className="text-xl font-medium ml-2 bg-blue-100 p-2 rounded-md">
          Cloud Computing
        </p>
      </div>
      {/* MINI_DASH*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {miniDash.map((content, idx) => (
          <div
            key={idx}
            className="border border-gray-200 bg-white rounded-xl p-5"
          >
            <h3 className="text-2xl">{content.Tag}</h3>
            <h1 className="text-3xl font-semibold mt-3">{content.Num}</h1>
          </div>
        ))}
      </div>
      {/* PROJECTS / SKILLS / CERTIFIVATE */}
      <div className="flex flex-col lg:flex-row w-full mt-10 h-auto lg:h-[65%]">
        {/* MEGA PROJ */}
        <div className="border border-gray-200 bg-[#F9FAFB] w-full lg:w-1/2 m-2 rounded-md">
          <MegaprjDash />
        </div>

        {/* SKILLS_CERTIFICATE */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="border border-gray-200 bg-[#F9FAFB] h-auto lg:h-[40%] m-2 rounded-md">
            <Skillsdash />
          </div>
          <div className="border border-gray-200 bg-[#F9FAFB] h-auto lg:max-h-[48%] m-2 rounded-md">
            <Certificate />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
