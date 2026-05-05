'use client'

import React, { useState, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { 
  Search, 
  UserCircle, 
  Globe, 
  LayoutGrid,
  FileText,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import DraftModal from '@/app/components/draftModal.jsx';
import ProductDetailModal from '@/app/components/productModal';
import GetDraft from '@/app/services/showcase/getDraft.js';
import GetProducts from '@/app/services/showcase/getProduct';

const GreenShowcaseV2 = () => {
  const { profile } = useUser();

//   const dummy = [
//     {
//   "id": "365a8b58-9637-47cf-b0eb-63552cff6e27",
//   "title": "Lampu Hias Minimalis",
//   "material_category": "Plastik PET (botol air minum)",
//   "ai_validation_status": "Complete",
//   "final_image_url": "https://asxzmovxhuepuzcgjghu.supabase.co/storage/v1/object/public/projects/validation_365a8b58-9637-47cf-b0eb-63552cff6e27_1773216202013.jpeg",
//   "user_id": "0d2db5c0-f92b-435a-b894-95fd1cdb92c4",
//   "price": null,
//   "description": null,
//   "whatsapp": null
// },
// {
//   "id": "1f37215c-27b7-4f4a-bb47-91d3db148f2f",
//   "title": "Pupuk Kompos Rumahan",
//   "material_category": "Sampah organik (sisa makanan, kulit buah, sayuran)",
//   "ai_validation_status": "Complete",
//   "final_image_url": "https://asxzmovxhuepuzcgjghu.supabase.co/storage/v1/object/public/projects/validation_1f37215c-27b7-4f4a-bb47-91d3db148f2f_1773220767524.jpeg",
//   "user_id": "0d2db5c0-f92b-435a-b894-95fd1cdb92c4",
//   "price": null,
//   "description": null,
//   "whatsapp": null
// },
// {
//   "id": "9b649777-9252-4602-9859-8d91171e0693",
//   "title": "Pembungkus Kado Rustic",
//   "material_category": "Kertas (paper bag) dan Tali",
//   "ai_validation_status": "Published",
//   "final_image_url": "https://asxzmovxhuepuzcgjghu.supabase.co/storage/v1/object/public/projects/validation_9b649777-9252-4602-9859-8d91171e0693_1772699437362.jpeg",
//   "user_id": "0d2db5c0-f92b-435a-b894-95fd1cdb92c4",
//   "price": 90000,
//   "description": "p balab",
//   "whatsapp": 42348888888
// },
// {
//   "id": "4cc003ce-381d-4ac6-b743-109d85e73a15",
//   "title": "Bahan Bangunan Inovatif (Eco-Panel)",
//   "material_category": "Plastik PET (botol air minum)",
//   "ai_validation_status": "Published",
//   "final_image_url": "https://asxzmovxhuepuzcgjghu.supabase.co/storage/v1/object/public/projects/validation_4cc003ce-381d-4ac6-b743-109d85e73a15_1773202545187.jpeg",
//   "user_id": "0d2db5c0-f92b-435a-b894-95fd1cdb92c4",
//   "price": 50000,
//   "description": "p insyallah barokah",
//   "whatsapp": 9999999
// }
//   ]

  const [viewMode, setViewMode] = useState('explore'); // 'explore' | 'profile'
  const [filter, setFilter] = useState('Published'); // Published | Complete
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useReducer((state, action) => {
    switch (action.type) {
      case "INITIAL":
        return  action.data
      case "SEARCH":
        return
    }
  })
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
  }, []);c
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    const fetchProducts = async () => {
        const res = await GetProducts() // Ganti dengan ID user yang sesuai
        if (res.success) {
            setProducts({ type: "INITIAL", data: res.data})
        } else {
            toast.error("Error fetching drafts:", res.message)
        }
    }
    fetchProducts();
  }, [profile?.id])

  const filteredProjects = projects.filter(p => p.ai_validation_status === filter);

  const handleOpenEdit = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };


  return (
    <div className="min-h-screen bg-slate-50 pb-28">

      <header className="bg-white px-6 md:px-6 pt-12 pb-4 shadow-sm sticky top-0 z-30">
        <div className="flex justify-between items-center mb-6 ">
          <h1 className="text-2xl font-black text-emerald-800 tracking-tight">Showcase</h1>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button 
              onClick={() => setViewMode('explore')}
              className={`p-2 md:px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'explore' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
            >
              <Globe size={16} /> Jelajah
            </button>
            <button 
              onClick={() => setViewMode('profile')}
              className={`p-2 md:px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'profile' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
            >
              <UserCircle size={16} /> Profil Toko
            </button>
          </div>
        </div>

        {viewMode === 'explore' && (
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Cari karya dari plastik, logam..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </header>

      {/* Content Area */}
      <main className="p-6">
        {viewMode === 'explore' ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-emerald-700">
              <TrendingUp size={18} />
              <h2 className="font-bold">Populer Minggu Ini</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 group">
              {products?.map(item => (
                <div 
                key={item.id} 
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
                onClick={() => handleOpenEdit(item)}>
                  <img src={item.final_image_url} className="h-32 w-full object-cover hover:scale-110 transition-transform duration-500" alt={item.title} />
                  <div className="p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.name}</p>
                    <h3 className="font-bold text-sm text-slate-800 truncate">{item.title}</h3>
                    <p className="text-emerald-600 font-black text-sm mt-1">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <ProductDetailModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              product={selectedProject}
            />
          </div>
        ) : (
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
        )}
      </main>
    </div>
  );
};

export default GreenShowcaseV2;

