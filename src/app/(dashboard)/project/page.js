'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
import { 
  Users, 
  User, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  LayoutGrid,
  Trophy,
  Package
} from 'lucide-react';

import ScannerModal from '@/app/components/scannerModal';
import ShowProjectTeam from '@/app/components/showProject';
import GetProject from '@/app/services/project/getProject';

const MyProjectsPage = () => {
  const [activeTab, setActiveTab] = useState('Individual'); 
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isShowProject, setIsShowProject] = useState(false)
  const [isProjectSelected, setIsProjectSelected] = useState(null)
  const [projects, setProjects] = useState({
    Individual: { ongoing: [], completed: [] },
    Community: { ongoing: [], completed: [] }
  });
  
  const searchParams = useSearchParams();
  const { profile, user } = useUser();
  const params = searchParams.get('mode');

  useEffect(() => {
    if (localStorage.getItem('temp_image_scanner')) {
      setIsScannerOpen(true);
      setActiveTab(localStorage.getItem('scanner_mode') || 'Individual');
    }
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      const res = await GetProject(user?.id)
      if (res.success) {
        setProjects(res.data)
      } else {
        toast.error(res.message)
      }
    }
    fetchProjects()
  }, [profile]);

  const currentProjects = projects[activeTab];

  return (
    <div className="relative min-h-screen bg-slate-50 pb-32 flex flex-col">
      {/* Header & Toggle */}
      <div className="bg-white px-6 pt-12 pb-6 shadow-sm sticky top-0 z-10 rounded-b-[2rem]">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
          <LayoutGrid className="text-emerald-600" /> Workshop Saya
        </h1>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('Individual')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'Individual' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            <User size={18} /> Individual
          </button>
          <button 
            onClick={() => setActiveTab('Community')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'Community' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Users size={18} /> Community
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Section: Ongoing */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-amber-500" />
            <h2 className="font-bold text-slate-700">Sedang Berjalan</h2>
            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">
              {currentProjects.ongoing.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {currentProjects.ongoing.map((project) => (
              <div key={project.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600">
                            {project.difficulty}
                        </span>
                        <div className="flex items-center gap-1 text-emerald-600 font-black text-sm">
                            <Trophy size={14} /> {project.points_earned || project.point} pts
                        </div>
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{project.title}</h3>
                    <div className="flex items-center gap-1.5 text-slate-500">
                        <Package size={14} />
                        <p className="text-xs font-medium">{project.material}</p>
                    </div>
                </div>

                {activeTab === 'Community' && (
                    <div className="flex items-center justify-between py-2 border-t border-slate-50">
                        <div className="flex -space-x-2">
                            {project.members?.slice(0, 3).map((m, i) => (
                                <div key={i} className="w-7 h-7 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                    {m.name?.[0] || 'U'}
                                </div>
                            ))}
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">
                            {project.member_count} Anggota
                        </span>
                    </div>
                )}
                
                <button onClick={() => {setIsProjectSelected(project), setIsShowProject(true)}} className="w-full py-3 text-sm font-bold bg-slate-900 rounded-2xl text-white hover:bg-slate-800 flex items-center justify-center gap-1">
                  Detail Project <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Completed */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={18} className="text-emerald-500" />
            <h2 className="font-bold text-slate-700">Sudah Selesai</h2>
          </div>

          <div className="grid gap-4">
            {currentProjects.completed.map((project) => (
              <div key={project.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-100 shadow-sm opacity-75">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{project.title}</h3>
                    <p className="text-[10px] text-slate-500 font-medium italic">Selesai pada {project.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-600">+{project.point} Pts</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <div className=' bottom-8 left-0 right-0 px-6 z-20'>
          <button 
            onClick={() => {
              setIsScannerOpen(true)
            }} 
            className='w-full py-4 bg-emerald-500 shadow-xl shadow-emerald-200 rounded-2xl text-lg text-white font-bold active:scale-95 transition-transform'
          >
            + Buat Project Baru
          </button>
      </div>

      {isScannerOpen && (
        <ScannerModal 
          isOpen={isScannerOpen} 
          onClose={() => setIsScannerOpen(false)} 
          mode={activeTab} 
          isChoose={params} // masih sementarra blum digunakan 
        />
      )}

      {isShowProject && (
        <ShowProjectTeam
          isOpen={isShowProject}
          project={isProjectSelected}
          onClose={() => setIsShowProject(false)}
        />
      )}
    </div>
  );
};

export default MyProjectsPage;