import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Landingpage from './Pages/Landingpage';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import HomePage from './Pages/HomePage';
import VerifyEmail from './Pages/VerifyEmail';
import ProtectedRoute from './Components/ProtectedRoute';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import OAuthSuccessPage from './Pages/OauthSuccess';
import SidebarNav from './Components/SidebarNav';
import CareerOS from './Pages/CareerOS';
import Marketplace from './Pages/Marketplace';
import Mockinterview from './Pages/Mockinterview';
import Resume from './Pages/Resume';
import Portfolio from './Pages/Portfolio';
import CareerForm from './Pages/CareerForm';
import CareerStatus from './Pages/CareerStatus';
import CareerPlanPage from "./Pages/CareerPlanPage";
import Certificate from './Components/Certificate';
import CertificateTest from './Components/CertificateTest';


const App = () => {
  const location = useLocation();

  // Define routes where SidebarNav should be visible
  const sidebarRoutes = ['/home','/career-os','/marketplace','/mock-interview',"/resume-tools",'/portfolio'];

  return (
    <>
    <div className='flex'>
      {sidebarRoutes.includes(location.pathname) && <SidebarNav />}

      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/oauth-success" element={<OAuthSuccessPage />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/career-os"
          element={
            <ProtectedRoute>
              <CareerOS />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock-interview"
          element={
            <ProtectedRoute>
              <Mockinterview/>
            </ProtectedRoute>
          }
        />
         <Route
          path="/resume-tools"
          element={
            <ProtectedRoute>
              <Resume/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/career-form"
          element={
            <ProtectedRoute>
              <CareerForm/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/career/status"
          element={
            <ProtectedRoute>
              <CareerStatus/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/career/plan"
          element={
            <ProtectedRoute>
              <CareerPlanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <CertificateTest />
            </ProtectedRoute>
          }
        />
   
      </Routes>

      </div>
    </>
  );
};

export default App;
