import React from 'react';
import { X, Tag, Phone, FileText, Save, Globe, GlobeOff  } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
import CreateProduct from '../services/showcase/createProduct';
import PublishedProduct from '../services/showcase/publishedProduct';
import UnpublishedProject from '../services/showcase/unpublishedProject';

const DraftModal = ({ isOpen, onClose, project, setProjects }) => {
  const { profile } = useUser();

  if (!isOpen || !project) return null;

  const handleEdit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const formValue = Object.fromEntries(formData.entries())
    const res = await CreateProduct(formValue, profile.id, project.id)
    if (res.success){
      await setProjects({type: "EDIT", data: res.data})
      toast.success('Berhasil Mengedit Draft: ',res.message)
    } else {
      toast.error("Gagal Mengedit Draft: ",res.message)
    }
  }

  const handlePublished = async (e) => {
    e.preventDefault()
    const res = await PublishedProduct(project.id)
    if (res.success){
      await setProjects({type: "PUBLISHED", data: res.data})
      toast.success('Berhasil Published Draft: ',res.message)
    } else {
      toast.error('Gagal Published Draft: ', res.message)
    }
  }

  const handleUnpublished = async (e) => {
    e.preventDefault()
    const res = await UnpublishedProject(project.id)
    if (res.success){
      await setProjects({type: "UNPUBLISHED", data: res.data})
      toast.success('Berhasil Unpublished Draft: ',res.message)
    } else {
      toast.error('Gagal Unpublished Draft: ',res.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pb-21 p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8  ">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Edit Detail Publikasi</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <form className="space-y-5"
                onSubmit={(e) => handleEdit(e)}>
            {/* Input Harga */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Harga Produk</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                <input 
                  type="number" 
                  name='price'
                  defaultValue={project.price || ""}
                  placeholder="Contoh: Rp 50.000"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Input WhatsApp */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nomor WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                <input 
                  type="tel" 
                  name='whatsapp'
                  defaultValue={project.whatsapp || ""}
                  placeholder="081..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Input Deskripsi */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Deskripsi Karya</label>
              <div className="relative flex items-start">
                <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
                <textarea 
                  rows="4"
                  name='description'
                  defaultValue={project.description || ""}
                  placeholder="Ceritakan proses pembuatan atau keunggulan produk ini..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none text-sm"
                />
              </div>
            </div>

            <div className='flex flex-col gap-4'>
              <div className='flex gap-4'>
                <button 
                  type="button"
                  onClick={(e) => handlePublished(e)}
                  className="w-full py-4 bg-emerald-600 text-xs md:text-base text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <Globe  className='w-4 h-4 md:w-6 md:h-6' /> Publikasikan
                </button>
                <button 
                  type="button"
                  onClick={(e) => handleUnpublished(e)}
                  className="w-full py-4 bg-emerald-600 text-xs md:text-base text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <GlobeOff className='w-4 h-4  md:w-6 md:h-6' /> Rubah ke Draft
                </button>
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-emerald-600 text-md text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
              >
                <Save className='w-5 h-5 md:w-6 md:h-6' /> Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DraftModal;