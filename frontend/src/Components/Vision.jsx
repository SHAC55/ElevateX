import React from "react";
import vision from '../assets/vision.jpg';
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Vision = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col-reverse md:flex-row p-6 md:p-16 bg-gradient-to-r from-[#F9FAFB] to-[#F0F4FF]"
    >
      {/* Text Section */}
      <div className="w-full md:w-3/5 md:pr-10 mt-8 md:mt-0">
        <p className="text-indigo-600 font-medium uppercase tracking-wider mb-3">Our Vision</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
          Unlocking Opportunities for Every Ambitious Learner
        </h1>
        <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-700 font-normal leading-relaxed">
          We’re on a mission to empower students from 
          <span className="font-semibold text-[#5A7FF1]"> Tier 2, 3, and 4 colleges</span>—those who may not have had access to top institutions, but have the drive to learn, grow, and succeed.
          At <span className="font-semibold text-[#5A7FF1]">ElevateX</span>, we believe talent isn’t defined by your college name, but by your commitment to growth.
          Our platform bridges the gap by offering 
          <span className="font-semibold text-[#5A7FF1]"> personalized, AI-powered guidance</span>, helping students build 
          <span className="font-semibold text-[#5A7FF1]"> in-demand skills</span>, gain 
          <span className="font-semibold text-[#5A7FF1]"> real-world confidence</span>, and land the jobs they deserve.
          We’re not just another ed-tech tool—we’re a 
          <span className="font-semibold text-[#5A7FF1]"> movement to level the playing field</span> for every learner who dares to dream beyond their limitations.
        </p>

        <div className="mt-6 p-4 border-l-4 border-indigo-500 bg-indigo-50 text-indigo-900 italic text-lg rounded-md">
          “The right support can change a life. We’re here to make sure every ambitious student—no matter where they start—gets the chance to thrive.” — Saif, Founder
        </div>

        {/* CTA Button */}
        <button className="mt-8 bg-[#5A7FF1] text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300">
          Join the Movement
        </button>
      </div>

      {/* Image Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        className="w-full md:w-2/5 mb-6 md:mb-0 flex justify-center items-center"
      >
        <img
          src={vision}
          alt="Vision"
          className="w-full max-w-md rounded-xl shadow-lg object-cover"
        />
      </motion.div>
    </motion.div>
  );
};

export default Vision;
