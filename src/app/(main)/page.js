"use client"
import React from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { 
  Search,
  Lamp,
  ShoppingBasket,
  Mail, Instagram, Twitter, Github, ArrowUpRight, Recycle, Globe, Zap
} from 'lucide-react';
import { div } from 'framer-motion/client';
    
export default function LandingPage () {
    const { profile } = useUser(); 

    const currentYear = new Date().getFullYear();

    const tech = [
      {title: "Gemini", image: "./gemini.png" },
      {title: "Supabase", image: "./supabase.jpeg" },
      {title: "Next.Js", image: "./next.svg" },
      {title: "Tailwind", image: "./tailwind.png" },
    ]

    const features =[
      {title: "Smart Idea Recognition", icon: Search, desc: "Utilize our advanced computer vision technology to identify waste materials in seconds. Just snap a photo of your scraps, and Ray Trashing will categorize the material—plastic, wood, metal, or fabric—and assess its potential for rebirth." },
      {title: "Adaptive AI Assistance", icon: Lamp, desc: "Get 24/7 guidance from our specialized chatbot. It doesn't just give instructions; it solves problems. Ask questions like 'How do I reinforce this joint?' or 'What paint works best here?' and receive instant, expert-level advice throughout your build." },
      {title: "Scalabel E-commerce", icon: ShoppingBasket, desc: "Skip the hassle of traditional selling. Our integrated marketplace allows you to list your finished upcycled products instantly. We handle the logistics and SEO, making it easier for eco-conscious customers to find and purchase your unique creations." },
    ]

    const impacts = [
      { percentage: "20 %", title: "Carbon Footprint Reduction", desc: "Reducing potential carbon emissions per active user by extending material lifecycles and decreasing the demand for new mass-produced goods.", position: "top-[10%] left-[-5%] md:left-[10%]" },
      { percentage: "30 %", title: "Economic Empowerment", desc: "Boosting local creators' supplemental income via the Eco-Marketplace, providing global market access for products previously considered waste.", position: "top-[-5%] left-[50%] -translate-x-1/2" },
      { percentage: "50 %", title: "Community Skill Elevation", desc: "Significantly increasing public literacy and expertise in creative manufacturing techniques through 24/7 AI-driven mentorship and guidance.", position: "top-[10%] right-[-5%] md:right-[10%]" },
      { percentage: "75 %", title: "Waste Transformation Index", desc: "Achieving a high success rate in converting non-organic household waste into functional upcycled products through high-accuracy AI Blueprints.", position: "bottom-[15%] left-[-5%] md:left-[5%]" },
      { percentage: "40 %", title: "Landfill Diversion Target", desc: "Diverting a substantial amount of specific waste from landfills per partner community by optimizing material inputs through the smart chatbot system.", position: "bottom-[15%] right-[-5%] md:right-[5%]" },
    ];

    const steps = [
      {
        id: 1,
        title: "Identify Your Scraps",
        description: "Snap a photo and let our AI recognize the waste material in seconds.",
        side: "left" // Untuk menentukan posisi teks
      },
      {
        id: 2,
        title: "Generate Blueprints",
        description: "Get a step-by-step creative guide tailored specifically to your waste.",
        side: "right"
      },
      {
        id: 3,
        title: "Smart Crafting Support",
        description: "Consult our AI tutor 24/7 for expert techniques and real-time solutions.",
        side: "left"
      },
      {
        id: 4,
        title: "List & Monetize",
        description: "Post your finished masterpiece on our marketplace and start earning.",
        side: "right"
      }
    ];

  return (
    <>
      <section className="relative main-container text-center inset-0 h-dvh pt-20 top-[-80]">
        <div className="lg:col-span-6 md:col-span-4 col-span-4 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-4xl lg:text-7xl font-extrabold leading-tight mb-6 bg-gradient-to-b from-custom-alter to-custom-third bg-clip-text text-transparent">
            Don’t Just Toss It—Transform It into Your Next Masterpiece.
          </h1>
          <p className="text-lg lg:text-xl mb-10 max-w-2xl mx-auto">
            Why let potential go to waste? Our advanced AI analyzes your household scraps to provide step-by-step upcycling blueprints tailored just for you. Once your creation is finished, list it directly on our dedicated marketplace to turn your eco-friendly hobby into a sustainable source of income.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-custom-alter text-white rounded-2xl font-bold text-lg shadow-xl shadow-custom-alter/40 hover:scale-105 transition-transform">
                {profile ? (
                  <Link href="/dashboard">
                      Lihat Dashboard
                  </Link>
                ) : (
                  <Link href="/auth?mode=login">
                      Masuk Sekarang
                  </Link>
                )}
              </button>
          </div>
        </div>
        <div className="hidden md:flex lg:col-span-6 md:col-span-4 col-span-2 items-center ustify-center">
          <div className='shape-custom w-full aspect-square overflow-hidden'>
            <img src="./hero-image.webp" alt="Hero Image" className="w-full h-full object-cover " />
          </div>
        </div>
      </section>

      <section className="gradation-container min-h-[60vh] flex flex-col justify-center overflow-hidden">
        <div className='gradation-item main-container'>
          <h2 className="col-span-4 md:col-span-8 lg:col-span-12 text-xl md:text-3xl font-bold text-center text-custom-alter mb-10">
            Creating Innovation With Future Technologies
          </h2>

          <div className="col-span-4 md:col-span-8 lg:col-span-12 flex justify-center items-center flex-wrap gap-4 md:gap-8">
            {tech.map((item, i) => (
              <div 
                key={i} 
                className="bg-white h-20 w-36 md:h-28 md:w-48 lg:h-44 lg:w-64 p-5 rounded-2xl shadow-sm border border-custom-third/50 flex items-center justify-center hover:shadow-md hover:scale-105 transition-all duration-300 "
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-contain " 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="main-container items-center md:h-dvh mt-20 md:mt-0">
        <div className="col-span-4 md:col-span-8 lg:col-span-12 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-custom-alter mb-20">
              Integrating Cutting-Edge AI into Every Step of Creation
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 lg:gap-8 lg:px-20"> 
              {features.map((item, i) => (
                <div key={i} className='md:col-span-4 flex justify-center'> 
                  <div className='relative w-full aspect-[1/1] max-w-[400px] rounded-3xl shadow-xl bg-gradient-to-b from-custom-second/80 to-white overflow-hidden'>
                    {/* Ikon Background */}
                    <div className='absolute inset-0 flex items-center justify-center'>  
                      <item.icon className="w-3/4 h-3/4 opacity-30 text-white" />
                    </div>
                    
                    {/* Konten Teks */}
                    <div className='absolute inset-0 z-10 flex flex-col justify-center items-center gap-4 p-6'>
                      <h3 className='lg:text-4xl md:text-2xl text-3xl font-bold text-custom-alter text-center'>{item.title}</h3>
                      <p className='text-center lg:text-lg md:text-sm text-base opacity-90'>{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>

     <section id="t1" className="relative flex flex-col md:h-[100vh] bg-white overflow-hidden pt-20">
        {/* 1. Gradation Container - TETAP 60dvh */}
        <div className="gradation-container-2 h-[60dvh] flex-shrink-0 overflow-hidden pt-[10vh] z-0">
          <div className='gradation-item'>
            <h2 className="text-2xl md:text-4xl font-bold text-custom-alter text-center px-4">
              Making Changes from Small Steps is the Beginning of a Real Big Impact
            </h2>
          </div>
        </div>

        <div className="relative -mt-[23vh] md:-mt-[30vh] flex-grow h-full main-container pb-20">
           <div className="col-span-4 md:col-span-8 lg:col-span-12 flex flex-wrap justify-center items-stretch gap-6 w-full h-full">
            {impacts.map((item, i) => (
              <div
                key={i}
                className="relative p-5 lg:p-6 rounded-[2rem] bg-white shadow-2xl border border-gray-50 hover:shadow-custom-first/20 transition-all duration-500 group w-full md:w-[48%] lg:w-[31%]"
              >
                <div className="absolute top-4 right-6 text-5xl text-custom-first/5 group-hover:text-custom-first/15 transition-colors">
                  0{i + 1}
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="inline-block px-3 py-1 bg-custom-first/10 text-custom-second rounded-full text-[9px] font-bold mb-3 uppercase tracking-widest">
                    Impact Metric
                  </div>

                  <span className="text-3xl lg:text-4xl font-black text-custom-alter mb-1">
                    {item.percentage}
                  </span>

                  <h4 className="text-md lg:text-lg font-bold text-custom-alter mb-2 leading-tight group-hover:text-custom-second transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-[11px] lg:text-xs text-custom-third/80 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                    {item.desc}
                  </p>
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-custom-first rounded-full group-hover:w-20 transition-all"></div>
              </div>
            ))}
           </div>
        </div>
      </section>

      <section
        id="t2"
        className="w-full md:h-dvh flex items-center pt-20"
      >
          <div className="bg-custom-third h-[90%] w-full flex flex-col justify-center items-center py-10 md:py-10 overflow-hidden">
            <h2 className="text-2xl md:text-4xl text-center font-bold text-white mb-10">
              4 Simple steps make a treasure
            </h2>
            <div className='relative w-full h-full flex flex-col justify-center px-10 space-y-4 lg:space-y-5'>
              <div className='hidden md:block absolute inset-0 h-full w-2 left-1/2 -translate-x-1/2 bg-white/10 rounded-full border border-white/20 '/>
              {steps.map((step) => (
                <div key={step.id} className="relative">
                  <div
                    className={[
                      "flex w-full",
                      step.side === "left"
                        ? "justify-center md:justify-end"
                        : "justify-center md:justify-start",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "w-[92%] md:w-[100%] bg-white/10 border border-white/20 backdrop-blur rounded-3xl p-[2vw]",
                        step.side === "left"
                          ? "md:mr-[51%] md:text-right"
                          : "md:ml-[51%] md:text-left",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "flex items-start gap-4",
                          step.side === "left"
                            ? "md:justify-end justify-center"
                            : "md:justify-start justify-center",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-center min-w-11 h-11 rounded-full bg-custom-first/20 border border-custom-first/30 text-custom-first font-extrabold text-lg">
                          {String(step.id).padStart(2, "0")}
                        </div>

                        <div className="text-center md:text-left md:text-base">
                          <h3 className="text-white font-bold text-lg xl:text-xl leading-snug">
                            {step.title}
                          </h3>
                          <p className="text-white/80 mt-1 text-sm xl:text-lg leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-custom-first border-4 border-custom-third" />
                </div>
              ))}
            </div>
          </div>
      </section>

      <footer className="relative bg-white py-10 overflow-hidden">

        <div className="hidden md:block absolute top-0 left-1/4 w-1/2 h-4 rounded-full bg-custom-first/80" />

        <div className="main-container">
          <div className="col-span-4 md:col-span-4 lg:col-span-6 flex flex-col items-center justify-center md:items-start gap-4">
            <div className="flex items-center w-fit h-fit gap-2 bg-custom-third text-white py-2 px-4 md:py-3 md:px-6 rounded-xl border hover:bg-white hover:text-custom-third transition-colors duration-300">
              <span className="text-xl md:text-2xl font-bold tracking-tight whitespace-nowrap">
                Ray Trashing
              </span>
              <div className="h-5 md:h-10 aspect-square overflow-hidden rounded-md">
                <img src="./logos.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <p className='text-center md:text-start md:text-lg text-custom-alter'>
              App to help you make help you make treasure from trash and sell it to earn money. 
              Powered by generative ai chatbot which help for chatting and totorial to create treasure. 
              Marketplace integrations with many products and you can pay it with many methode.
            </p>
            <ul className='flex gap-4 '>
              <li className='text-custom-third/80 '>
                <Mail className='w-7 h-7 md:w-10 md:h-10'/> 
              </li>
              <li className='text-custom-third/80 '>
                <Instagram className='w-7 h-7 md:w-10 md:h-10'/> 
              </li>
              <li className='text-custom-third/80 '>
                <Twitter className='w-7 h-7 md:w-10 md:h-10'/>
              </li>
              <li className='text-custom-third/80 '>
                <Github className='w-7 h-7 md:w-10 md:h-10'/> 
              </li>
            </ul>
            
          </div>

          <div className="col-span-4 md:col-span-4 lg:col-span-6 flex flex-col items-center md:items-end">
            <div className='flex flex-col items-start gap-4'>
              <h3 className='text-xl md:text-2xl font-bold text-custom-third'>Navigation</h3>
              <ul className='flex md:flex-col items-center justify-center md:items-start text-custom-alter gap-4'>
                <li className='text-center'>About</li>
                <li className='text-center'>Features</li>
                <li className='text-center'>Impact Projection</li>
                <li className='text-center'>Workflow</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

// const data = [
//       { name: "About", href: "#about" },
//       { name: "Features", href: "#features" },
//       { name: "Impact Projection", href: "#impact-projection" },
//       { name: "Workflow", href: "#workflow" },
//   ]
