// src/pages/Learning/CareerLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import LearningNavbar from "../../Components/Learning/LearningNavbar";

const CareerLayout = () => {
  return (
    <div>
      <LearningNavbar />
      <main className="pt-20"> {/* Push content below navbar */}
        <Outlet />
      </main>
    </div>
  );
};

export default CareerLayout;
