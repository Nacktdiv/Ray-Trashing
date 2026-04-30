"use client"
import React from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { 
  Camera, 
  Users, 
  Globe
} from 'lucide-react';

function FeatureCard({ icon: Icon, title, desc, color }) {

  return (
    <div className="w-[350px] p-8 rounded-3xl bg-emerald-50 border border-slate-300 shadow-md hover:shadow-lg hover:scale-105 transition-transform flex-shrink-0">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-${color}-100 text-${color}-600 || 'bg-slate-100'}`}>
            {Icon}
        </div>
        <h3 className={`text-xl text-${color}-500 font-bold mb-3`}>{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
    
export default function LandingPage () {
    const { profile } = useUser(); 

    const tech = [
      {title: "Gemini", image: "./gemini.png" },
      {title: "Supabase", image: "./supabase.jpeg" },
      {title: "Next.Js", image: "./next.svg" },
      {title: "Tailwind", image: "./tailwind.png" },
    ]

  return (
    <>
      <section className="relative main-container text-center inset-0 h-dvh ">
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
        <div className="hidden md:block bg-red-100 lg:col-span-6 md:col-span-4 col-span-2">
        </div>
      </section>

      <section className="curved-bg-wrapper min-h-[40vh] flex flex-col justify-center">
        <div className="relative-content main-container">
          <h2 className="col-span-4 md:col-span-8 lg:col-span-12 text-xl md:text-3xl font-bold text-center text-custom-alter mb-10">
            Creating Innovation With Future Technologies
          </h2>

          <div className="col-span-4 md:col-span-8 lg:col-span-12 flex justify-center items-center flex-wrap gap-4 md:gap-8">
            {tech.map((item, i) => (
              <div 
                key={i} 
                className="bg-white h-20 w-36 md:h-28 md:w-48 lg:h-32 lg:w-56 p-5 rounded-2xl shadow-sm border border-custom-third/50 flex items-center justify-center hover:shadow-md hover:scale-105 transition-all duration-300 "
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

      <div className="main-container py-12 ">
        <div className="col-span-4 md:col-span-8 lg:col-span-12 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-custom-alter mb-6">
              Integrating Cutting-Edge AI into Every Step of Creation
            </h2>
            
            {/* Tempat untuk FeatureCards atau konten tambahan lainnya */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* <FeatureCard ... /> */}
            </div>
        </div>
      </div>
    </>
  );
};