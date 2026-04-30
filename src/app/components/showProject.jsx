'use client'

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  CheckCircle2, 
  Users, 
  Trophy, 
  Package, 
  ChevronRight, 
  Copy, 
  MessageCircle, 
  Edit3,
  GoalIcon,
  ClipboardList,
  X,
  Camera,     
  Loader2      
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

import UpdateTask from '../services/project/updateTask';
import ValidationProject from '../services/project/validationProject';
import CompressImage from './shared/compressImage';

const ShowProjectTeam = ({ project, onClose }) => {
  const { profile } = useUser()

  const [data, setData] = useState(
    project || {
      id: "",
      title: "",
      type: "Community",
      members: []
    }
  )

  const [isEdit, setIsEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const [task, setTask] = useState(
    (project?.members || []).map(member => ({
      ...member,
      task: member.task || "" 
    }))
  );

  useEffect(() => {
    if (project?.members) {
      setTask(project.members.map(m => ({ ...m, task: m.task || "" })));
      setData(project);
    }
  }, [project]);

  const handleEditTask = (value, index) => {
    setTask(prev => prev.map((item, i) => 
      i === index ? { ...item, task: value } : item
    ));
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
      const compressedBase64 = await CompressImage(file);
      setSelectedImage({path:compressedBase64, type:file.type});
      } catch (error) {
        console.error("Gagal kompres:", error);
      }
    }
  };

  const handleValidation = async () => {
    if (!selectedImage) return toast("Pilih gambar terlebih dahulu");
    
    setIsValidating(true);

    const base64Data = selectedImage.path.split(',')[1] 
    const res = await ValidationProject(base64Data, selectedImage.type, data)
    
    if (res.success) {
      setIsValidating(false);
      toast.success(`Berhasil memvalidasi project: ${res.message}`);
      setSelectedImage(null);
      window.location.href = '/project'
    } else {
      setIsValidating(false);
      toast.error(`Gagal memvalidasi project: ${res.message}`);
    }
  };

  const handleSubmitTask = async () => {
    setIsLoading(true);
    const res = await UpdateTask(task)
    if (res.success) {
      setData(prev => ({
        ...prev,
        members: prev.members.map(m => {
          const updated = task.find(t => t.member_id === m.member_id);
          return updated ? { ...m, task: updated.task } : m;
        })
      }));
      setIsEdit(false);
      toast.success(res.message);
      window.location.href = '/project'
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  const isLeader = data.members.find(m => m.user_id === profile?.id)?.role === 'Leader';
  const isCommunity = data.type === "Community";
  const completedMembers = data.members.filter(m => m.is_completed).length;
  const progressPercentage = data.members.length > 0 
    ? Math.round((completedMembers / data.members.length) * 100) 
    : 0;

  const handleCopyCode = () => {
    if (data.join_code) {
      navigator.clipboard.writeText(data.join_code);
      toast.success("Kode berhasil disalin!");
    }
  };

  const handleNavigateToChat = () => {
    window.location.href = `/chatbot?name=${project?.title}&id=${project?.id}`
  }

  return (
    <div className='fixed z-50 inset-0 flex justify-center pt-10 p-4'>
      <div className='absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity' onClick={onClose}></div>

      <div className="z-10 bg-white w-full max-w-lg max-h-[75vh] md:max-h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        <div className="p-6 bg-emerald-600 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-xl"><ClipboardList size={24} /></div>
            <div className="flex flex-col items-end mr-10">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded-md">{data.type} Project</span>
              <div className="flex items-center gap-1 mt-1 text-emerald-100 font-bold text-sm"><Trophy size={14} /> {data.points_earned} Pts</div>
            </div>
          </div>
          <h2 className="text-2xl font-black leading-tight mb-1 pr-8">{data.title}</h2>
          <p className="text-emerald-100 text-xs flex items-center gap-1"><Package size={12} /> {data.material} • {data.difficulty}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-slate-700">Progress Tim</span>
              <span className="text-xl font-black text-emerald-600">{progressPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>

          {isCommunity && (
            <div className="bg-blue-50 border-2 border-dashed border-blue-200 p-4 rounded-3xl flex flex-col items-center gap-2">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Invite Your Team</span>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-blue-600 tracking-widest font-mono">{data.join_code}</span>
                <button onClick={handleCopyCode} className="p-2 bg-white rounded-xl text-blue-500 shadow-sm active:scale-90 transition-transform"><Copy size={18} /></button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Daftar Kontributor</h4>
              {isLeader && (
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button className={`p-1.5 rounded-lg ${!isEdit ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`} onClick={() => setIsEdit(false)}><Users size={18}/></button>
                  <button className={`p-1.5 rounded-lg ${isEdit ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`} onClick={() => setIsEdit(true)}><Edit3 size={18}/></button>
                </div>
              )}
            </div>
            
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {data.members.map((member, index) => (
                <div key={member.member_id} className="p-4 bg-slate-50 rounded-[1.5rem] border border-transparent hover:border-emerald-200 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${member.is_completed ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                        {member.is_completed ? <CheckCircle2 size={20} /> : member.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-slate-800 text-sm">{member.name}</p>
                          {member.isMe && <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-bold">Anda</span>}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{member.role}</p>
                      </div>
                    </div>
                    {isEdit && isLeader ? (
                      <button onClick={handleSubmitTask} disabled={isLoading} className="p-2 bg-emerald-500 text-white rounded-lg disabled:opacity-50"><GoalIcon size={16} /></button>
                    ) : (
                      <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${member.is_completed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{member.is_completed ? 'DONE' : 'PENDING'}</span>
                    )}
                  </div>
                  <div className="mt-2 pl-12">
                    <input 
                      className={`w-full text-[11px] italic bg-transparent outline-none ${isEdit ? 'border-b border-blue-200 text-slate-800' : 'text-slate-500'}`}
                      disabled={!isEdit}
                      onChange={(e) => handleEditTask(e.target.value, index)}
                      value={task[index]?.task || ""}
                      placeholder="Belum ada tugas spesifik..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-[2rem] border-2 border-dashed border-slate-200 space-y-3">
            <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-widest text-center">Validasi Bukti Proyek</h4>
            <div className="flex flex-col items-center gap-3">
              {selectedImage ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden group">
                  <img src={selectedImage.path} alt="Preview" className="w-full h-full object-cover" />
                  <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full"><X size={14} /></button>
                </div>
              ) : (
                <label className="w-full py-8 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white transition-colors">
                  <Camera className="text-slate-400" size={32} />
                  <span className="text-[11px] font-bold text-slate-400">Klik untuk upload foto proyek</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
              <button 
                onClick={handleValidation}
                disabled={!selectedImage || isValidating}
                className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${selectedImage && !isValidating ? 'bg-emerald-500 text-white shadow-lg active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                {isValidating ? <><Loader2 size={16} className="animate-spin" /> Menganalisis...</> : <><CheckCircle2 size={16} /> Kirim Validation</>}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-slate-50">
          <button onClick={handleNavigateToChat} className="w-full py-4 rounded-2xl font-black bg-slate-900 text-white shadow-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-[0.98]">
            <MessageCircle size={20} /> Masuk ke Ruang Chat <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ShowProjectTeam;