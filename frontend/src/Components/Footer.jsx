import React from 'react'
import insta from'../assets/insta.png'
import x from'../assets/x.png'
import linkedin from'../assets/linkedin.png'
import discord from'../assets/discord.png'

const Footer = () => {
  return (
    <footer className="bg-[#f8f9fb] py-10 px-6 md:px-20 mt-24">
  <div className="flex flex-col md:flex-row justify-between gap-8">
    
    {/* Brand / About */}
    <div className="md:w-1/3">
      <h3 className="text-xl font-bold mb-2">ElevateX</h3>
      <p className="text-gray-600">
        Empowering you with the tools, insights, and guidance to build the career you deserve.
      </p>
    </div>

    {/* Links */}
    <div className="md:w-1/3 flex justify-between">
      <div>
        <h4 className="font-semibold mb-2">Company</h4>
        <ul className="text-gray-600 space-y-1">
          <li><a href="#">About</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Support</h4>
        <ul className="text-gray-600 space-y-1">
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">FAQ</a></li>
        </ul>
      </div>
    </div>

    {/* Social */}
    <div className="md:w-1/3">
      <h4 className="font-semibold mb-2">Follow Us</h4>
      <div className="flex space-x-4 mt-2">
        <a href="#"><img src={insta} className="w-6" alt="Instagram" /></a>
        <a href="#"><img src={x} className="w-6" alt="X" /></a>
        <a href="#"><img src={linkedin} className="w-6" alt="linkedin" /></a>
        <a href="#"><img src={discord} className="w-6" alt="discord" /></a>
      </div>
    </div>
  </div>

  <div className="mt-8 text-center text-sm text-gray-500">
    © {new Date().getFullYear()} ElevateX. All rights reserved.
  </div>
</footer>

  )
}

export default Footer