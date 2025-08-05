import React from 'react';
import {
  FaUserGraduate,
  FaLightbulb,
  FaLaptopCode,
  FaGlobe,
  FaBullseye,
  FaClock,
  FaCalendarCheck
} from 'react-icons/fa';

const iconMap = {
  interest: <FaLightbulb className="text-blue-600 text-xl mr-2" />,
  skills: <FaLaptopCode className="text-blue-600 text-xl mr-2" />,
  education: <FaUserGraduate className="text-blue-600 text-xl mr-2" />,
  experience: <FaCalendarCheck className="text-blue-600 text-xl mr-2" />,
  careergoal: <FaBullseye className="text-blue-600 text-xl mr-2" />,
  timeconstraint: <FaClock className="text-blue-600 text-xl mr-2" />,
  availabilty: <FaGlobe className="text-blue-600 text-xl mr-2" />
};

const questions = [
  {
    name: 'interest',
    label: 'What kind of work excites you the most?',
    options: [
      'Building websites or apps',
      'Designing visual experiences',
      'Working with numbers & data',
      'Communicating with people',
      'Solving logical & technical problems',
      'Writing or creating content',
      'Deployment Operations',
    ],
  },
  {
    name: 'skills',
    label: 'Which of these skills do you currently have or are learning?',
    options: [
      'JavaScript / React / Node.js',
      'Python / ML / Data Science',
      'UI/UX Design / Figma / Adobe XD',
      'SQL / MongoDB / Databases',
      'Public speaking / Communication',
      'Writing or Blogging',
      'Project Management',
    ],
  },
  {
    name: 'education',
    label: 'What are you currently studying?',
    options: ['B.E / B.tech', 'Bsc', 'Computer Science', 'Other / Not Enrolled'],
  },
  {
    name: 'experience',
    label: 'What is your experience level?',
    options: [
      'Internship',
      'Freelance',
      'Hackathon',
      'Open-Source Contributor',
      'Fresher',
      'Beginner',
    ],
  },
  {
    name: 'careergoal',
    label: 'What are you aiming for?',
    options: [
      'High paying job',
      'Startup job',
      'Freelance career',
      'Goverment job',
      'Study Abroad',
      'MAANG Companies',
    ],
  },
  {
    name: 'timeconstraint',
    label: 'Are you planning to?',
    options: [
      'Get a job in less than 6 Months',
      'Prepare for job over the next year',
      '2nd - 3rd year B.Tech Student',
      'Still exploring options',
      'Switching career',
    ],
  },
  {
    name: 'availabilty',
    label: 'How much time can you dedicate weekly to learning/upskilling?',
    options: [
      '< 5 Hours',
      '5 - 10 Hours',
      '10 - 20 Hours',
      '20 - 30 Hours',
      'Dedicate as per requirement',
    ],
  },
];

const EditCareer = ({ formData, onChange }) => {
  return (
    <div className="space-y-8 mt-4">
      {questions.map((q) => (
        <div key={q.name} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <div className="flex items-center mb-3">
            {iconMap[q.name]}
            <h3 className="text-lg font-semibold text-gray-800">{q.label}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((option, idx) => (
              <label
                key={idx}
                className={`flex items-center px-3 py-2 rounded-lg border hover:bg-blue-50 transition cursor-pointer ${
                  formData[q.name] === option
                    ? 'border-blue-500 bg-blue-50 text-blue-800 font-medium'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name={q.name}
                  value={option}
                  checked={formData[q.name] === option}
                  onChange={onChange}
                  className="mr-3 accent-blue-600"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditCareer;
