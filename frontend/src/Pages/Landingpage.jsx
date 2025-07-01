import React from "react";
import Header from "../Components/Header";
import Hero from "../Components/Hero";
import Feature from "../Components/Feature";
import Howitwork from "../Components/Howitwork";
import Testimonals from "../Components/Testimonals";
import Pricing from "../Components/Pricing";
import Faq from "../Components/Faq";
import Cta from "../Components/Cta";
import Footer from "../Components/Footer";
import Vision from "../Components/Vision";

const Landingpage = () => {
  return (
    <div className="bg-[#f8f9fe] min-w-[350px]">

      <Header />
      <Hero />
      <Feature/>
      <Howitwork/>
      <Vision/>
      <Testimonals/>
      <Pricing/>
      <Faq/>
      <Cta/>
      <Footer/>
      
    </div>
  );
};

export default Landingpage;
