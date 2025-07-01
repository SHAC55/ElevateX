import React from 'react';
import banner from '../assets/Howitwork.jpg';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const steps = [
  {
    step: 'Step 1',
    title: 'Create Your Profile',
    desc: 'Sign up and tell us about your interests, background, and goals.'
  },
  {
    step: 'Step 2',
    title: 'Get Your Career Plan & AI Feedback',
    desc: 'Receive a personalized roadmap and instant AI feedback on your resume and goals.'
  },
  {
    step: 'Step 3',
    title: 'Build, Practice & Apply',
    desc: 'Gain skills, take mock interviews, and start applying to curated job opportunities.'
  },
  {
    step: 'Step 4',
    title: 'Track Progress & Share Portfolio',
    desc: 'Measure your growth, update your portfolio, and share it with recruiters.'
  }
];

const Howitwork = () => {
  return (
    <div className="py-10 px-4 mx-auto bg-[#f8f9fb] mt-10">
      <h2 className="text-5xl font-bold text-center mb-12">How It Works</h2>

      <div className="flex flex-col md:flex-row justify-center items-start gap-10">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full md:w-1/2"
        >
          <img src={banner} alt="How it works banner" className="w-full rounded-xl " />
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col space-y-8 relative w-full md:w-1/2">
          {steps.map((step, index) => {
            const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

            return (
              <motion.div
                key={index}
                ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex items-start space-x-4"
              >
                {/* Circle Number */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="h-20 w-px bg-blue-300 mx-auto"></div>
                  )}
                </div>

                {/* Step Content */}
                <div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-gray-600 mt-1">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Howitwork;
