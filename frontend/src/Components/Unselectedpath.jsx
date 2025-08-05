import React from "react";
import { FaCheckCircle, FaLightbulb, FaProjectDiagram } from "react-icons/fa";
import { MdQuiz, MdTrackChanges } from "react-icons/md";
import { RiRoadMapLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const UnselectedPath = ( {refreshStatus}) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 sm:p-10 bg-white rounded-2xl lg:mt-10 mt-16 lg:max-w-[98%] mx-auto transition-all duration-300 lg:ml-5">
      {/* Heading */}
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Welcome to <span className="text-indigo-600">CareerOS</span> — Your
        Personal Career Roadmap Assistant!
      </h1>

      {/* Bullet Points */}
      <ul className="space-y-4 mb-10 text-lg text-gray-700">
        <li className="flex items-start">
          <FaCheckCircle className="text-indigo-600 mt-1 mr-2" />
          <span>
            Receive a personalized learning plan tailored to your goals.
          </span>
        </li>
        <li className="flex items-start">
          <FaCheckCircle className="text-indigo-600 mt-1 mr-2" />
          <span>Build job-ready projects to showcase your talent.</span>
        </li>
        <li className="flex items-start">
          <FaCheckCircle className="text-indigo-600 mt-1 mr-2" />
          <span>
            Stay focused and track your progress toward your dream role.
          </span>
        </li>
      </ul>

      {/* Alert Box */}
      <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-xl mb-8 flex items-start">
        <RiRoadMapLine className="text-indigo-600 text-2xl mr-4 mt-1" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            You haven't selected a career goal yet.
          </h2>
          <p className="text-gray-700">
            Let us help you find the right path and start your journey with
            confidence.
          </p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
        <button
          onClick={() => navigate("/career-form")}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition duration-200 shadow-sm"
        >
          Choose Career Path
        </button>
        <p className="text-gray-700 text-md flex items-center gap-1">
          <MdQuiz className="text-indigo-600 text-xl" />
          <span>
            Not sure what to choose?{" "}
            <a onClick={() => navigate("/career-form")} className="text-indigo-600 font-medium hover:underline cursor-pointer">
              Take our quiz for suggestions
            </a>
          </span>
        </p>
      </div>

      {/* What You'll Unlock Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🎁 What You’ll Unlock After Choosing a Path
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Item 1 */}
          <div className="flex items-start bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
            <FaLightbulb className="text-indigo-600 text-2xl mr-4 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Tailored Learning Track
              </h3>
              <p className="text-gray-700">
                A curated step-by-step roadmap based on your selected goal.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-start bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
            <FaProjectDiagram className="text-indigo-600 text-2xl mr-4 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Job-Ready Projects
              </h3>
              <p className="text-gray-700">
                Hands-on project templates to build and showcase your portfolio.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-start bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
            <MdTrackChanges className="text-indigo-600 text-2xl mr-4 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Career Progress Tracker
              </h3>
              <p className="text-gray-700">
                Set milestones and monitor your skill-building progress.
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex items-start bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
            <FaCheckCircle className="text-indigo-600 text-2xl mr-4 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Smart Recommendations
              </h3>
              <p className="text-gray-700">
                Get AI-based resource & role suggestions aligned with your
                goals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Footer */}
      <div className="mt-12 text-center text-gray-600 text-sm italic">
        🚀 Every great career begins with a single decision.{" "}
        <span className="text-indigo-600 font-semibold">
          Take your first step
        </span>{" "}
        with CareerOS today!
      </div>
    </div>
  );
};

export default UnselectedPath;
