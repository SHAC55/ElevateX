import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const Header = () => {

  const navigate = useNavigate()

  return (
    <motion.header
      className='flex justify-between items-center p-5'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.1
      }}
    >
      <h1 className='text-2xl font-semibold'>ElevateX</h1>

      <div className='flex space-x-4'>
        <motion.button
          className='w-28 border rounded-md p-2'
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
          onClick={() => navigate('/login')}
        >
          Login
        </motion.button>
        
        <motion.button
          className='bg-[#5A7FF1] p-2 rounded-md text-white w-28'
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
          onClick={() => navigate('/signup')}
        >
          Sign up
        </motion.button>
      </div>
    </motion.header>
  )
}

export default Header
