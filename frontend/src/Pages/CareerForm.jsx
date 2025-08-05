import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { chooseCareer } from '../api/career';
const questions = [
  {
    tag: 'STEP 1 : Know you better - Interest Mapping',
    label: 'What kind of work excites you the most?',
    name: 'interest',
    type: 'mcq',
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
    tag: 'STEP 2 : Skills & Strengths',
    label: 'Which of these skills do you currently have or are learning?',
    name: 'skills',
    type: 'mcq',
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
    tag: 'STEP 3 : Education',
    label: 'What are you currently studying?',
    name: 'education',
    type: 'mcq',
    options: ['B.E / B.tech', 'Bsc', 'Computer Science', 'Other / Not Enrolled'],
  },
  {
    tag: 'STEP 4 : Experience',
    label: 'What is your experience level?',
    name: 'experience',
    type: 'mcq',
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
    tag: 'STEP 5 : Career Goals',
    label: 'What are you aiming for?',
    name: 'careergoal',
    type: 'mcq',
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
    tag: 'STEP 6 : Time Constraints',
    label: 'Are you planning to?',
    name: 'timeconstraint',
    type: 'mcq',
    options: [
      'Get a job in less than 6 Months',
      'Prepare for job over the next year',
      '2nd - 3rd year B.Tech Student',
      'Still exploring options',
      'Switching career',
    ],
  },
  {
    tag: 'STEP 7 : Availability',
    label: 'How much time can you dedicate weekly to learning/upskilling?',
    name: 'availabilty',
    type: 'mcq',
    options: [
      '< 5 Hours',
      '5 - 10 Hours',
      '10 - 20 Hours',
      '20 - 30 Hours',
      'Dedicate as per requirement',
    ],
  },
];

const CareerForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      interest: '',
      skills: '',
      education: '',
      experience: '',
      careergoal: '',
      timeconstraint: '',
      availabilty: '',
    },
  });

const onSubmit = async (data) => {
  console.log('Form submitted:', data);

  try {
    const res = await chooseCareer(data);
    toast.success('Career choice saved successfully! 🎉');
    setTimeout(() => {
      navigate('/career-os'); // 🔁 Redirect
    }, 1500); // Optional delay for toast visibility
  } catch (err) {
    console.error(err);
    toast.error(err?.response?.data?.message || 'Failed to save career choice.');
  }
};


  const nextStep = async () => {
    const valid = await trigger(questions[step].name);
    if (valid) setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const current = questions[step];

  return (
    <div className='w-full'>

      <div className='ml-10 mr-10'>
      <h1 className='text-4xl font-bold mt-4'>Shape Your Future in Tech with Smart Guidance</h1>
      <h2 className='text-2xl font-serif'>Answer a few questions and discover the most suitable career path in tech based on your skills, interests, and goals.</h2>
      </div>

    <div className="m-4 mx-auto p-6 bg-white rounded-xl mt-8 ml-10 mr-10">
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h1 className="bg-blue-50 p-2 font-bold text-2xl">{current.tag}</h1>

          <label className="block text-2xl font-medium mb-2 mt-10 text-gray-800">
            {current.label}
          </label>

          {current.type === 'text' ? (
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              {...register(current.name, {
                required: 'This field is required',
              })}
            />
          ) : (
            <div className="space-y-2 mt-8">
              {current.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value={option}
                    {...register(current.name, {
                      required: 'Please choose one option',
                    })}
                    className="accent-indigo-600"
                  />
                  <span className='text-xl text-gray-500 mt-2'>{option}</span>
                </label>
              ))}
            </div>
          )}

          {errors[current.name] && (
            <p className="text-red-500 text-sm mt-1">
              {errors[current.name].message}
            </p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 0}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Back
          </button>

          {step < questions.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>

    </div>
  );
};

export default CareerForm;
