import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const questions = [
    {
      question: "How does this platform help with my job search?",
      ans: "We provide AI-powered feedback on your resume, personalized career planning, mock interviews, and curated job recommendations.",
    },
    {
      question: "Is the Starter plan really free?",
      ans: "Yes! The Starter plan includes essential tools and resources at no cost — no credit card required.",
    },
    {
      question: "Can I cancel or change my plan anytime?",
      ans: "Yes, you can upgrade, downgrade, or cancel your subscription at any time from your dashboard settings.",
    },
    {
      question: "What makes the Pro and Ultimate plans different?",
      ans: "Pro offers advanced tools and personalized career roadmaps, while Ultimate includes coaching, recruiter access, and branding support.",
    },
    {
      question: "How soon can I expect results?",
      ans: "Most users start seeing improvements in confidence, resumes, and interviews within 2–4 weeks of consistent use.",
    },
  ];

  return (
    <div className="mt-24 px-6 md:px-20 lg:px-32 py-10">
      <div className="flex flex-col lg:flex-row justify-between">
        {/* Left Section */}
        <div className="lg:w-[35%] mb-8 lg:mb-0 flex flex-col justify-between">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <div className="bg-[#f1f0f8] p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
            <p className="text-gray-600 mb-4">
              Can’t find the answer to your question? Send us an email and we’ll get back to you shortly.
            </p>
            <button className="bg-[#5A7FF1] text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Send Email
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:w-[60%] space-y-4">
          {questions.map((item, index) => (
            <motion.div
              key={index}
              onClick={() => toggleAnswer(index)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`cursor-pointer p-4 rounded-lg transition-all duration-300 shadow-sm border hover:shadow-md ${
                activeIndex === index ? "bg-indigo-50 border-indigo-400" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">{item.question}</h3>
                <motion.span
                  initial={false}
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl font-bold text-indigo-500"
                >
                  {activeIndex === index ? "−" : "+"}
                </motion.span>
              </div>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.p
                    key="answer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-600 mt-3"
                  >
                    {item.ans}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
