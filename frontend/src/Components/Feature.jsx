import React from 'react'
import { motion } from 'framer-motion'

import skills from '../assets/skills.png'
import resume from '../assets/resume.png'
import path from '../assets/path.png'
import dashboard from '../assets/dashboard.png'
import interview from '../assets/interview.png'
import assesment from '../assets/assesment.png'
import portfolio from '../assets/portfolio.png'
import resource from '../assets/resource.png'

const Feature = () => {
  const features = [
    {
      logo: skills,
      name: 'Top Industry Skills & Insight',
      desc: 'Stay updated with the most in-demand skills and trends in your field.'
    },
    {
      logo: resume,
      name: 'AI Resume & Cover Letter Generator',
      desc: 'Generate polished, tailored resumes and cover letters in seconds using AI.'
    },
    {
      logo: path,
      name: 'Dynamic Career Roadmaps',
      desc: 'Visualize your career path with adaptive goals based on your interests and industry.'
    },
    {
      logo: dashboard,
      name: 'Smart Dashboard',
      desc: 'A centralized hub to manage learning, job tracking, and professional growth.'
    },
    {
      logo: interview,
      name: 'AI-Powered Mock Interviews',
      desc: 'Practice with realistic, AI-driven interview simulations and get instant feedback.'
    },
    {
      logo: assesment,
      name: 'Skill Assessments',
      desc: 'Test your knowledge and receive personalized recommendations for improvement.'
    },
    {
      logo: portfolio,
      name: 'Portfolio',
      desc: 'Showcase your work and skills in a professional, customizable online portfolio.'
    },
    {
      logo: resource,
      name: 'Resource Marketplace',
      desc: 'Access curated resources like courses, templates, and tools to accelerate your career.'
    },
  ]

  return (
    <div className='p-5 max-w-7xl mx-auto mt-10'>
      <h1 className='text-3xl md:text-4xl font-bold font-serif text-center mt-10 mb-10'>
        "Everything You Need. In One Dashboard."
      </h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className='p-6 border rounded-xl border border-blue-100 hover:shadow-lg transition bg-white'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <img
              src={feature.logo}
              alt={feature.name}
              className='h-12 w-12 mb-4 object-contain'
            />
            <h2 className='text-xl font-semibold mb-2'>{feature.name}</h2>
            <p className='text-gray-600'>{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Feature
