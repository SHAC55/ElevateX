import React from 'react'
import { motion } from 'framer-motion'
import heroImg from '../assets/Herosectimg.jpeg'

const Hero = () => {
  return (
    <div className='flex flex-col-reverse md:flex-row justify-around items-center p-5'>
      {/* Text */}
      <motion.div
        className='w-full md:w-[40%] text-center md:text-left'
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <p className='text-base text-gray-500 mt-10'>Your AI Career Companion</p>
        <h1 className='text-4xl md:text-5xl font-bold mt-3'>Empowering the NextGeneration WorkForce</h1>
        <p className='mt-3 text-lg md:text-2xl font-normal'>
          Get personalized career paths, resume feedback, job insight and many more features.
        </p>

        <div className='flex flex-col md:flex-row items-center md:items-start space-y-3 md:space-y-0 md:space-x-4 mt-4'>
          <button className='bg-[#5A7FF1] p-2 rounded-md text-white w-40'>Get Started Free</button>
          <button className='w-40 border p-2 rounded-md'>Watch Demo</button>
        </div>
      </motion.div>

      {/* Image */}
      <motion.div
        className='w-full md:w-[50%] mt-8 md:mt-0 flex justify-center'
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <img src={heroImg} className='w-[80%] md:w-[90%] md:h-[550px]' alt="Hero section" />
      </motion.div>
    </div>
  )
}

export default Hero
