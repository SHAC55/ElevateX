
// // App.jsx
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Landingpage from "./Pages/Landingpage";
// import Login from "./Pages/Login";
// import Signup from "./Pages/Signup";
// import HomePage from "./Pages/HomePage";
// import VerifyEmail from "./Pages/VerifyEmail";
// import ProtectedRoute from "./Components/ProtectedRoute";
// import ForgotPassword from "./Pages/ForgotPassword";
// import ResetPassword from "./Pages/ResetPassword";
// import OAuthSuccessPage from "./Pages/OauthSuccess";
// import SidebarNav from "./Components/SidebarNav";
// import CareerOS from "./Pages/CareerOS";
// import Marketplace from "./Pages/Marketplace";
// import Mockinterview from "./Pages/Mockinterview";
// import Resume from "./Pages/Resume";
// import Portfolio from "./Pages/Portfolio";
// import CareerForm from "./Pages/CareerForm";
// import CareerStatus from "./Pages/CareerStatus";
// import CareerPlanPage from "./Pages/CareerPlanPage";
// import CertificateTest from "./Components/CertificateTest";

// // ✅ Learning Section
// import LearningNavbar from "./Components/Learning/LearningNavbar";
// import CareerOverview from "./Pages/Learning/CareerOverview";
// import LearningResources from "./Pages/Learning/LearningResources";
// import PracticeProjects from "./Pages/Learning/PracticeProjects";
// import ProgressTracker from "./Pages/Learning/ProgressTracker";
// import Roadmap from "./Pages/Learning/Roadmap";
// import SkillsToLearn from "./Pages/Learning/SkillsToLearn";
// import Communities from "./Pages/Learning/Communities";
// import CareerOutlook from "./Pages/Learning/CareerOutlook";
// import SkillDetailPage from "./Pages/Learning/SkillDetailsPage";

// // --------------------- Layouts ---------------------
// const SidebarLayout = ({ children }) => (
//   <div className="flex min-h-screen">
//     <SidebarNav />
//     <main className="flex-1 p-4">{children}</main>
//   </div>
// );

// const CareerLayout = () => (
//   <div className="flex flex-col min-h-screen">
//     <LearningNavbar />
//     <main className="flex-1 pt-0 px-4">
//       {/* Nested route content renders here */}
//       <Routes>
//         <Route index element={<CareerPlanPage />} />
//         <Route path="overview" element={<CareerOverview />} />
//         <Route path="skills" element={<SkillsToLearn />} />
//         <Route path="projects" element={<PracticeProjects />} />
//         <Route path="resources" element={<LearningResources />} />
//         <Route path="progress" element={<ProgressTracker />} />
//         <Route path="roadmap" element={<Roadmap />} />
//         <Route path="communities" element={<Communities />} />
//         <Route path="outlook" element={<CareerOutlook />} />
//         <Route path="*" element={<Navigate to="/career/plan" replace />} />
//       </Routes>
//     </main>
//   </div>
// );

// // --------------------- App ---------------------
// const App = () => {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<Landingpage />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/verify-email" element={<VerifyEmail />} />
//       <Route path="/forgot-password" element={<ForgotPassword />} />
//       <Route path="/reset-password" element={<ResetPassword />} />
//       <Route path="/oauth-success" element={<OAuthSuccessPage />} />

//       {/* Protected Routes with Sidebar */}
//       <Route
//         path="/home"
//         element={
//           <ProtectedRoute>
//             <SidebarLayout>
//               <HomePage />
//             </SidebarLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/career-os"
//         element={
//           <ProtectedRoute>
//             <SidebarLayout>
//               <CareerOS />
//             </SidebarLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/marketplace"
//         element={
//           <ProtectedRoute>
//             <SidebarLayout>
//               <Marketplace />
//             </SidebarLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/mock-interview"
//         element={
//           <ProtectedRoute>
//             <SidebarLayout>
//               <Mockinterview />
//             </SidebarLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/resume-tools"
//         element={
//           <ProtectedRoute>
//             <SidebarLayout>
//               <Resume />
//             </SidebarLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/career/plan/skills/:skillId"
//         element={
//           <ProtectedRoute>
//              <LearningNavbar>
//               <SkillDetailPage />
            
//           </LearningNavbar>
//              </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/portfolio"
//         element={
//           <ProtectedRoute>
//             <SidebarLayout>
//               <Portfolio />
//             </SidebarLayout>
//           </ProtectedRoute>
//         }
//       />
     
//       <Route
//         path="/career-form"
//         element={
//           <ProtectedRoute>
//             <SidebarLayout>
//               <CareerForm />
//             </SidebarLayout>
//           </ProtectedRoute>
//         }
//       />

//       {/* Career Learning Routes with LearningNavbar */}
//       <Route
//         path="/career/status"
//         element={
//           <ProtectedRoute>
//             <CareerLayout>
//               <CareerStatus />
//             </CareerLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/career/plan/*"
//         element={
//           <ProtectedRoute>
//             <CareerLayout />
//           </ProtectedRoute>
//         }
//       />

//       {/* Certificate Testing */}
//       <Route
//         path="/test"
//         element={
//           <ProtectedRoute>
//             <CertificateTest />
//           </ProtectedRoute>
//         }
//       />

//       {/* Catch-all redirect */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// };

// export default App;


// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landingpage from "./Pages/Landingpage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import HomePage from "./Pages/HomePage";
import VerifyEmail from "./Pages/VerifyEmail";
import ProtectedRoute from "./Components/ProtectedRoute";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import OAuthSuccessPage from "./Pages/OauthSuccess";
import SidebarNav from "./Components/SidebarNav";
import CareerOS from "./Pages/CareerOS";
import Marketplace from "./Pages/Marketplace";
import Mockinterview from "./Pages/Mockinterview";
import Resume from "./Pages/Resume";
import Portfolio from "./Pages/Portfolio";
import CareerForm from "./Pages/CareerForm";
import CareerStatus from "./Pages/CareerStatus";
import CareerPlanPage from "./Pages/CareerPlanPage";
import CertificateTest from "./Components/CertificateTest";

// ✅ Learning Section
import LearningNavbar from "./Components/Learning/LearningNavbar";
import CareerOverview from "./Pages/Learning/CareerOverview";
import LearningResources from "./Pages/Learning/LearningResources";
import PracticeProjects from "./Pages/Learning/PracticeProjects";
import ProgressTracker from "./Pages/Learning/ProgressTracker";
import Roadmap from "./Pages/Learning/Roadmap";
import SkillsToLearn from "./Pages/Learning/SkillsToLearn";
import Communities from "./Pages/Learning/Communities";
import CareerOutlook from "./Pages/Learning/CareerOutlook";
import SkillDetailPage from "./Pages/Learning/SkillDetailsPage";

// --------------------- Layouts ---------------------
const SidebarLayout = ({ children }) => (
  <div className="flex min-h-screen">
    <SidebarNav />
    <main className="flex-1 p-4">{children}</main>
  </div>
);

const CareerLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <LearningNavbar />
    <main className="flex-1 pt-0 px-4">
      {children}
    </main>
  </div>
);

// --------------------- App ---------------------
const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landingpage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/oauth-success" element={<OAuthSuccessPage />} />

      {/* Protected Routes with Sidebar */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <HomePage />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/career-os"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <CareerOS />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/marketplace"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <Marketplace />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mock-interview"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <Mockinterview />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-tools"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <Resume />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolio"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <Portfolio />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />
     
      <Route
        path="/career-form"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <CareerForm />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />

      {/* Career Learning Routes with LearningNavbar */}
      <Route
        path="/career/status"
        element={
          <ProtectedRoute>
            <CareerLayout>
              <CareerStatus />
            </CareerLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Skill Detail Page */}
      <Route
        path="/career/plan/skills/:skillId"
        element={
          <ProtectedRoute>
            <CareerLayout>
              <SkillDetailPage />
            </CareerLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Career Plan Pages */}
      <Route
        path="/career/plan/*"
        element={
          <ProtectedRoute>
            <CareerLayout>
              <Routes>
                <Route index element={<CareerPlanPage />} />
                <Route path="overview" element={<CareerOverview />} />
                <Route path="skills" element={<SkillsToLearn />} />
                <Route path="projects" element={<PracticeProjects />} />
                <Route path="resources" element={<LearningResources />} />
                <Route path="progress" element={<ProgressTracker />} />
                <Route path="roadmap" element={<Roadmap />} />
                <Route path="communities" element={<Communities />} />
                <Route path="outlook" element={<CareerOutlook />} />
                <Route path="*" element={<Navigate to="/career/plan" replace />} />
              </Routes>
            </CareerLayout>
          </ProtectedRoute>
        }
      />

      {/* Certificate Testing */}
      <Route
        path="/test"
        element={
          <ProtectedRoute>
            <CertificateTest />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;