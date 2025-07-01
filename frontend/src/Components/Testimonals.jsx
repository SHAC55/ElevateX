import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import profile from "../assets/profile.png";
import quotationmark from "../assets/quotationmark.png";
import star from "../assets/star.png";
import star5 from "../assets/5starrating.png";

const Testimonals = () => {
  const feedbacks = [
    {
      logo: profile,
      name: "Mehwish",
      rating: "3.5/5",
      comment:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, animi dolor quaerat minus saepe nulla.",
    },
    {
      logo: profile,
      name: "Elizabeth",
      rating: "4.5/5",
      comment:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, animi dolor quaerat minus saepe nulla.",
    },
    {
      logo: profile,
      name: "Emily",
      rating: "4/5",
      comment:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, animi dolor quaerat minus saepe nulla.",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <div ref={ref} className="flex flex-col lg:flex-row items-center justify-between mt-16 px-4">
      {/* Left Section */}
      <div className="flex flex-col w-full lg:w-[40%] p-4 lg:p-10">
        <h1 className="text-4xl lg:text-5xl font-semibold bg-red-100 p-2 w-fit rounded-md">
          “What Our Customers Say”
        </h1>
        <p className="mt-4 text-gray-600 text-lg lg:text-xl lg:w-[80%]">
          Don’t just take our word for it—hear from real users who boosted their skills, impressed recruiters, and landed job offers using our tools and guidance.
        </p>
        <img src={star5} className="w-32 mt-4" alt="5 star rating" />
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-[60%] p-4 lg:p-10 flex flex-wrap justify-center gap-4">
        {feedbacks.map((f, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
            }}
            className="bg-white w-full sm:w-[300px] rounded-md p-4 flex flex-col items-center shadow-md h-[350px]"
          >
            <img src={f.logo} className="w-20 mt-3" alt="Profile" />
            <img src={quotationmark} className="w-6 mt-4" alt="Quote" />
            <h2 className="text-lg font-semibold mt-2">{f.name}</h2>
            <div className="flex items-center justify-center">
              <p className="mt-2 font-medium">{f.rating}</p>
              <img src={star} className="w-5 ml-2" alt="Star" />
            </div>
            <p className="text-gray-500 text-sm text-center mt-6">{f.comment}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Testimonals;
