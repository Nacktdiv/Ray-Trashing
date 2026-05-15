import { useState, useReducer, useEffect } from "react";
import toast from 'react-hot-toast';
import {  Globe, LayoutGrid, FileText, ChevronRight, } from "lucide-react"
import DraftModal from '@/app/components/draftModal.jsx';
import { useUser } from '@/context/UserContext';
import GetDraft from '@/app/services/showcase/getDraft.js';

export default function MarketProfileMode() {
    const { profile } = useUser();

    const [projects, setProjects] = useReducer((state, action) => {
        switch (action.type) {
            case "INITIAL" :
                return action.data;
            case "EDIT" :
                return state.map(item => item.id === action.data.project_id ? {...item, price: action.data.price, description: action.data.description, whatsapp: action.data.whatsapp} : item)
            case "PUBLISHED" : 
                return state.map(item => item.id === action.data.id ? {...item, ai_validation_status: "Published"} : item)
            case "UNPUBLISHED" : 
                return state.map(item => item.id === action.data.id ? {...item, ai_validation_status: "Complete"} : item)
        }
      }, [])

    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('Published');

    useEffect(() => {
        const fetchDrafts = async () => {
            const res = await GetDraft(profile?.id) // Ganti dengan ID user yang sesuai
            if (res.success) {
                setProjects({ type: "INITIAL", data: res.data})
            } else {
                toast.error("Error fetching drafts:", res.message)
            }
        }
        fetchDrafts();
        // setProjects({ type: "INITIAL", data: dummy})
    }, [profile?.id])

    const handleOpenEdit = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const filteredProjects = projects.filter(p => p.ai_validation_status === filter);

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                    <LayoutGrid className="text-emerald-600" /> Katalog Karya Anda
                </h2>
                <p className="text-sm text-slate-500 font-medium">Kelola hasil upcycling yang telah divalidasi AI.</p>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200">
                <button 
                    onClick={() => setFilter('Published')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                    filter === 'Published' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400'
                    }`}
                >
                    <Globe size={16} /> PUBLISHED
                </button>
                <button 
                    onClick={() => setFilter('Complete')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                    filter === 'Complete' ? 'bg-white text-slate-600 shadow-sm' : 'text-slate-400'
                    }`}
                >
                    <FileText size={16} /> DRAFT
                </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProjects?.map((project) => (
                <div 
                    key={project.id}
                    onClick={() => handleOpenEdit(project)}
                    className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
                >
                    {/* Image Overlay */}
                    <div className="relative h-48 group-hover:scale-110 transition-transform duration-500">
                        <img src={project?.final_image_url} alt={project?.title} className="w-full h-full object-cover " />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                            <span className="bg-white text-slate-800 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1">
                            Edit Detail <ChevronRight size={14} />
                            </span>
                        </div>
                    </div>

                    <div className="p-5">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{project?.title}</h4>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{project?.material_category}</span>
                        <span className="text-emerald-600 font-black text-sm">{project?.price || "—"}</span>
                    </div>
                    </div>
                </div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="py-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
                <p className="text-slate-400 font-medium">Belum ada proyek dalam kategori ini.</p>
                </div>
            )}

            <DraftModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                project={selectedProject}
                setProjects = {setProjects}
            />
        </div> 
    )
}