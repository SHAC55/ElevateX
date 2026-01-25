// import React, { useEffect, useState } from "react";
// import MegaprjDash from "../Components/MegaprjDash";
// import Skillsdash from "../Components/Skillsdash";
// import Certificate from "../Components/Certificate";
// import { getDetailedJourneyDashboard, getCareerStatus } from "../api/career";

// const HomePage = () => {
//   const [userName, setUserName] = useState("");
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const boot = async () => {
//       try {
//         const [statusRes, dashRes] = await Promise.all([
//           getCareerStatus().catch(() => ({ user: "STUDENT" })), // don’t block UI if this fails
//           getDetailedJourneyDashboard(),
//         ]);
//         setUserName(statusRes?.user || "STUDENT");
//         setDashboardData(dashRes);
//       } catch (err) {
//         console.error("Failed to load homepage:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     boot();
//   }, []);

//   if (loading || !dashboardData) {
//     return <div className="p-6">Loading...</div>;
//   }

//   const {
//     completedSkills,
//     inProgressSkills,
//     miniProjects,
//     resumeScore,
//     projects,
//     goal,
//     skills,
//   } = dashboardData;

//   const miniDash = [
//     { Tag: "Skills Completed", Num: completedSkills },
//     { Tag: "Skills In Progress", Num: inProgressSkills },
//     { Tag: "Mini Projects", Num: miniProjects },  // currently 0 from API helper; wire real data when ready
//     { Tag: "ATS Resume Score", Num: resumeScore }, // currently 0 from API helper
//   ];

//   return (
//     <div className="w-full p-6 h-[910px] overflow-y-scroll bg-[#F9FAFB]">
//       {/* Welcome */}
//       <h1 className="text-3xl font-semibold">Welcome back, {userName}!</h1>

//       {/* Current Goal */}
//       <div className="flex mt-6 items-center">
//         <h3 className="text-xl font-medium">Current Goal :</h3>
//         <p className="text-xl font-medium ml-2 bg-blue-100 p-2 rounded-md">
//           {goal || "Not set"}
//         </p>
//       </div>

//       {/* Mini Dashboard */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
//         {miniDash.map((item, idx) => (
//           <div
//             key={idx}
//             className="border border-gray-200 bg-white rounded-xl p-5"
//           >
//             <h3 className="text-2xl">{item.Tag}</h3>
//             <h1 className="text-3xl font-semibold mt-3">{item.Num}</h1>
//           </div>
//         ))}
//       </div>

//       {/* Projects / Skills / Certificates */}
//       <div className="flex flex-col lg:flex-row w-full mt-10 gap-4">
//         {/* Mega Projects */}
//         <div className="w-full lg:w-1/2">
//           <div className="border border-gray-200 bg-white rounded-xl p-4 h-full">
//             <MegaprjDash projects={projects} />
//           </div>
//         </div>

//         {/* Skills + Certificates */}
//         <div className="w-full lg:w-1/2 flex flex-col gap-4">
//           {/* Skills Section */}
//           <div className="border border-gray-200 bg-white rounded-xl p-4 flex-grow min-h-[300px]">
//             <Skillsdash
//               skills={{
//                 foundational: skills?.foundation || [],
//                 intermediate: skills?.intermediate || [],
//                 advanced: skills?.advanced || [],
//                 soft: skills?.soft_skills || [],
//               }}
//             />
//           </div>

//           {/* Certificate Section */}
//           <div className="border border-gray-200 bg-white rounded-xl p-4 flex-grow min-h-[180px]">
//             <Certificate />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import React from "react";
import WelcomeDisplay from "../Components/WelcomeDisplay";
import AddProductButton from "../Components/AddProductButton";
import ListedProductButton from "../Components/ListedProductButton";
import SelledProductButton from "../Components/SelledProductButton";

const HomePage = () => {
  return (
    <div className="mt-20">
      <WelcomeDisplay />
      <div className="flex gap-3 mt-5">
        <AddProductButton />
        <ListedProductButton />
        <SelledProductButton />
      </div>
    </div>
  );
};

export default HomePage;
