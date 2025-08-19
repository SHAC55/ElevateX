


// import React from 'react';
// import { Routes, Route, useLocation } from 'react-router-dom';
// import Landingpage from './Pages/Landingpage';
// import Login from './Pages/Login';
// import Signup from './Pages/Signup';
// import HomePage from './Pages/HomePage';
// import VerifyEmail from './Pages/VerifyEmail';
// import ProtectedRoute from './Components/ProtectedRoute';
// import ForgotPassword from './Pages/ForgotPassword';
// import ResetPassword from './Pages/ResetPassword';
// import OAuthSuccessPage from './Pages/OauthSuccess';
// import SidebarNav from './Components/SidebarNav';
// import CareerOS from './Pages/CareerOS';
// import Marketplace from './Pages/Marketplace';
// import Mockinterview from './Pages/Mockinterview';
// import Resume from './Pages/Resume';
// import Portfolio from './Pages/Portfolio';
// import CareerForm from './Pages/CareerForm';
// import CareerStatus from './Pages/CareerStatus';
// import CareerPlanPage from "./Pages/CareerPlanPage";
// import CertificateTest from './Components/CertificateTest';

// // ✅ Learning Section
// import LearningNavbar from "./Components/Learning/LearningNavbar";
// import CareerOverview from "./Pages/Learning/CareerOverview";
// import LearningResources from "./Pages/Learning/LearningResources";
// import PracticeProjects from "./Pages/Learning/PracticeProjects";
// import ProgressTracker from "./Pages/Learning/ProgressTracker";
// import Roadmap from "./Pages/Learning/Roadmap";
// import SkillsToLearn from "./Pages/Learning/SkillsToLearn";
// import Communities from './Pages/Learning/Communities';
// import CareerOutlook from './Pages/Learning/CareerOutlook';

// const App = () => {
//   const location = useLocation();

//   // Routes where SidebarNav should be visible
//   const sidebarRoutes = [
//     '/home',
//     '/career-os',
//     '/marketplace',
//     '/mock-interview',
//     '/resume-tools',
//     '/portfolio'
//   ];

//   // Routes where LearningNavbar should be visible
//   const learningRoutes = [
//     '/career/plan',
//     '/career/overview',
//     '/career/resources',
//     '/career/projects',
//     '/career/progress',
//     '/career/roadmap',
//     '/career/skills'
//   ];

//   return (
//     <div className='flex'>
//       {/* Show SidebarNav only for dashboard-like routes */}
//       {sidebarRoutes.includes(location.pathname) && <SidebarNav />}

//       {/* Show LearningNavbar only for career learning routes */}
//       {learningRoutes.includes(location.pathname) && <LearningNavbar />}

//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Landingpage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/verify-email" element={<VerifyEmail />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         <Route path="/oauth-success" element={<OAuthSuccessPage />} />

//         {/* Auth Protected Routes */}
//         <Route
//           path="/home"
//           element={
//             <ProtectedRoute>
//               <HomePage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/career-os"
//           element={
//             <ProtectedRoute>
//               <CareerOS />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/marketplace"
//           element={
//             <ProtectedRoute>
//               <Marketplace />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/mock-interview"
//           element={
//             <ProtectedRoute>
//               <Mockinterview />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/resume-tools"
//           element={
//             <ProtectedRoute>
//               <Resume />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/portfolio"
//           element={
//             <ProtectedRoute>
//               <Portfolio />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/career-form"
//           element={
//             <ProtectedRoute>
//               <CareerForm />
//             </ProtectedRoute>
//           }
//         />

//         {/* Career Learning Routes */}
//         <Route
//           path="/career/status"
//           element={
//             <ProtectedRoute>
//               <CareerStatus />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/career/plan"
//           element={
//             <ProtectedRoute>
//               <CareerPlanPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/career/plan/overview"
//           element={
//             <ProtectedRoute>
//               <CareerOverview />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/career/plan/communities"
//           element={
//             <ProtectedRoute>
//               <Communities />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/career/plan/resources"
//           element={
//             <ProtectedRoute>
//               <LearningResources />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/career/plan/outlook"
//           element={
//             <ProtectedRoute>
//               <CareerOutlook />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/career/plan/projects"
//           element={
//             <ProtectedRoute>
//               <PracticeProjects />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/career/plan/progress"
//           element={
//             <ProtectedRoute>
//               <ProgressTracker />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/career/plan/roadmap"
//           element={
//             <ProtectedRoute>
//               <Roadmap />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/career/plan/skills"
//           element={
//             <ProtectedRoute>
//               <SkillsToLearn />
//             </ProtectedRoute>
//           }
//         />

//         {/* Certificate Testing */}
//         <Route
//           path="/test"
//           element={
//             <ProtectedRoute>
//               <CertificateTest />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </div>
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

// --------------------- Layouts ---------------------
const SidebarLayout = ({ children }) => (
  <div className="flex min-h-screen">
    <SidebarNav />
    <main className="flex-1 p-4">{children}</main>
  </div>
);

const CareerLayout = () => (
  <div className="flex flex-col min-h-screen">
    <LearningNavbar />
    <main className="flex-1 pt-20 px-4">
      {/* Nested route content renders here */}
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
      <Route
        path="/career/plan/*"
        element={
          <ProtectedRoute>
            <CareerLayout />
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
