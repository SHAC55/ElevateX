import React from "react";
import { motion } from "framer-motion";
import tick from "../assets/tick.png";

const Pricing = () => {
  const packs = [
    {
      pack: "Starter",
      desc: "Perfect for beginners just starting their career journey.",
      price: "$0",
      details: [
        "Create your profile & resume",
        "Basic AI feedback on goals",
        "Access to 5 free career resources",
        "Limited mock interview practice",
        "Community forum access",
      ],
    },
    {
      pack: "Pro",
      desc: "For serious job seekers who want to boost their chances.",
      price: "$29",
      details: [
        "Everything in Starter",
        "Advanced AI resume + portfolio review",
        "Unlimited mock interviews",
        "Personalized career roadmap",
        "Curated job matching",
        "Monthly 1:1 mentor session",
      ],
    },
    {
      pack: "Ultimate",
      desc: "For high achievers ready to land top roles with confidence.",
      price: "$59",
      details: [
        "Everything in Pro",
        "Weekly 1:1 career coaching calls",
        "Priority access to job openings",
        "Custom skill-building plans",
        "Portfolio hosting + branding support",
        "Direct recruiter introductions",
      ],
    },
  ];

  return (
    <div className="mt-24 px-4">
      <h1 className="text-center text-4xl md:text-5xl font-semibold">
        Choose your right plan!
      </h1>
      <p className="text-center mt-3 text-gray-500 max-w-2xl mx-auto">
        Choose the plan that fits your career goals. Whether you're just starting out or aiming for the top, we've got you covered.
      </p>

      {/* Pricing Cards */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {packs.map((plan, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition duration-300 flex flex-col justify-between"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <div>
              <h2 className="text-2xl font-bold mb-2 text-white bg-[#5A7FF1] w-fit p-1 px-3 rounded-md">
                {plan.pack}
              </h2>
              <p className="text-gray-600 font-medium mb-4 mt-6">{plan.desc}</p>
              <h3 className="text-3xl font-semibold mb-4">
                {plan.price}
                <span className="text-gray-500 text-lg ml-1">/month</span>
              </h3>
              <hr />
              <ul className="space-y-2 text-sm text-gray-700 mt-4">
                {plan.details.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <img src={tick} className="w-5 mt-1" alt="tick" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <hr className="mt-6" />
            <button className="mt-6 border font-semibold py-2 px-4 rounded-md hover:bg-[#5A7FF1] hover:text-white transition">
              Get Started
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
