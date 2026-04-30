import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import toast from 'react-hot-toast';

import { Camera, Upload, X, Trash2, Zap, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

import AnalyzeImage  from '../services/project/analyzeImage';
import CreateProject from '../services/project/createProject';
import JoinProject from '../services/project/joinProject';
import CompressImage from './shared/compressImage';

export default function ScannerModal ({ isOpen, onClose, mode }) {
  const {profile} = useUser()

  const [image, setImage] = useState(null);
  const [result, setResult]  = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedProject, setSelectedProject] = useState({
    title:"", 
    difficulty:'',
    type:mode,
    material_category:''
  });
  const[isCode, setIsCode] = useState('')

  if (!isOpen) return null;

  useEffect(() => {
  if (isOpen) {
    const savedImage = localStorage.getItem('temp_image_scanner');
    if (savedImage) {
      setImage(savedImage);
    }
  }
  }, [isOpen]);

  const handleAnalyze = async () => {

    const base64Content = image.split(',')[1]

    const res = await AnalyzeImage(base64Content)
    if (res.success) {
      setResult(res.data)
      setShowResults(true)
    } else {
      toast.error("Gagal analisis gambar sampah: ", res.message);
    }
    setIsAnalyzing(false)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]

    if (file) {
      try {
        const compressedBase64 = await CompressImage(file);
        setImage(compressedBase64);
        localStorage.setItem('temp_image_scanner', compressedBase64);
        localStorage.setItem('scanner_mode', mode);
        
      } catch (error) {
        toast.error("Gagal kompres dan menyimpan gambar:", error);
      }
    }
  };

  const handleClose = () => {
    localStorage.removeItem('temp_image_scanner');
    localStorage.removeItem('scanner_mode');
    setImage(null)
    setShowResults(false)
    onClose()
  }

  const handleJoinProject = async (e) => {
    e.preventDefault()
    
    const res = await JoinProject(isCode, profile)

    if (res.success) {
      toast.success("Berhasil Join Project: ", res.message)
      window.location.href = '/project'
    } else {
      toast.error("Gagal Join Project: ", res.message)
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()

    const res = await CreateProject(selectedProject, profile, result.emisi_co2_dicegah_kg)

    if (res.success) {
      localStorage.removeItem('temp_image_scanner');
      localStorage.removeItem('scanner_mode');
      toast.success("Berhasil membuat project: ", res.message)
      window.location.href = '/project'
    } else {
      toast.error("Gagal membuat project: ", res.message)
    }
  }

  return (
    <div className='fixed z-50 inset-0 flex justify-center items-center '>
      
      <div className='bg-linear-to-r from-transparent to-transparent absolute inset-0 z-50 backdrop-blur-sm'></div>

      <div className="z-50 bg-white w-full max-w-2xl max-h-screen rounded-md shadow-md overflow-hidden flex flex-col">
        
        <div className="p-3 md:p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <Sparkles size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">AI Waste Scanner</h2>
          </div>
          <button onClick={() => handleClose()} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 ">
        
          {!showResults ? (
            <div className="space-y-6">
              {!image ? (
                <>
                  <div className="border-2 border-dashed border-emerald-200 rounded-3xl p-10 flex flex-col items-center justify-center bg-emerald-50/30 gap-4">
                    <div className="flex gap-4">
                      <label className="flex flex-col items-center justify-center p-4 w-32 h-32 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm">
                        <Camera size={32} className="mb-2" />
                        <span className="text-sm font-bold">Ambil Foto</span>
                        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                      </label>
                      <label className="flex flex-col items-center justify-center p-4 w-32 h-32 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm">
                        <Upload size={32} className="mb-2" />
                        <span className="text-sm font-bold">Upload File</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                    <p className=" text-slate-500 font-medium text-center px-6">
                      Scan sampah plastik, kertas, atau logam Anda untuk mulai berkreasi.
                    </p>
                  </div>
                  {mode == 'Community' 
                  ? (
                    <div className='flex flex-col justify-center items-center p-4 bg-emerald-200 border-2 border-green-500 rounded-xl gap-4'>
                      <input 
                            type="text"
                            onChange={(e) => setIsCode(e.target.value)}
                            value={isCode}
                            placeholder='silahkan masukkan code'
                            className='w-full px-4 py-3 border-b-2 border-slate-200 bg-transparent focus:border-emerald-500 focus:outline-none transition-all duration-300 peer'/>
                      <button 
                            onClick={(e) => handleJoinProject(e)}
                            className='bg-black text-white font-bold border-2 border-slate-500 p-2 text-xl rounded-xl'>
                        Join With Code
                      </button>
                    </div>
                     )
                  : (<></>)}
                </>
              ) : (
                <div className="relative flex justify-center"> 
                    <div className='w-full aspect-video flex justify-center items-center border-2 border-emerald-200 border-dashed'>
                        <img src={image} alt="globe" className=' w-full h-full object-fit'/>
                    </div>
                    <div className='absolute inset-0 flex justify-center items-center'>
                      <button onClick={() => setImage(null)}>
                        <Trash2 size={32} className='text-emerald-200'></Trash2>
                      </button>
                    </div>
                </div>
              )}

              <button 
                onClick={() => handleAnalyze()}
                disabled={!image || isAnalyzing}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  image && !isAnalyzing 
                  ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Menganalisis Bahan...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    Mulai Analisis AI
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="text-blue-600" />
                <p className="text-sm font-medium text-blue-800">Bahan terdeteksi: <span className="font-bold">{result.bahan_terdeteksi}</span></p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(result).map(([level, items]) => {
                  if (level != "bahan_terdeteksi"){
                    return (
                      <div key={level} className="space-y-4 md:space-y-6 min-w-0 md:min-w-full">
                        <h3 className={`text-xs font-black uppercase tracking-widest px-2 ${
                          level === 'mudah' ? 'text-emerald-600' : level === 'sedang' ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {level}
                        </h3>
                        <div className='overflow-x-scroll'>
                          <div className="md:space-y-2 flex md:flex-col gap-2">
                            { Array.isArray(items) && items.map((item) => {
                              item.includes(':') ? item = item.split(":")[0] : item
                              return (
                                <button
                                key={item}
                                onClick={() => setSelectedProject({...selectedProject, title:item, difficulty: level, material_category:result?.bahan_terdeteksi})}
                                  className={`whitespace-nowrap md:whitespace-normal md:w-full text-left p-3 rounded-xl border text-sm font-medium transition-all ${
                                    selectedProject?.title === item 
                                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20' 
                                    : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                                  }`}
                                >
                                  {item}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  }
                })}
              </div>
              {showResults && (
                <div className="px-4 pt-4 md:px-6 md:pt-6 border-t border-slate-100 bg-white">
                    <button 
                        onClick={handleCreateProject}
                        disabled={!selectedProject?.title}
                        className={`w-full py-4 rounded-2xl font-bold transition-all shadow-xl ${
                          selectedProject?.title 
                          ? 'bg-emerald-600 text-white shadow-emerald-200 hover:scale-[1.02]' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Buat Project: {selectedProject?.title || "Pilih satu ide"}
                      </button>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
