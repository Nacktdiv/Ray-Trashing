"use client"
import { useState, useReducer, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import  Link  from "next/link";
import toast from 'react-hot-toast'

import { Mail, Lock, User, MapPin, ArrowRight, Github, Phone } from 'lucide-react';

import AuthInput from '../../components/auth'
import Login from '../../services/auth/login';
import Register from '../../services/auth/register';
import GetRt from '../../services/auth/getRt';
import GetCity from '@/app/services/auth/getcity';
import GetDistrict from '@/app/services/auth/getdistrict';
import useDebounce from '../../components/shared/debouncedFunction';

const AuthPage = () => {
  const searchParams = useSearchParams()

  const isLogin = searchParams.get('mode') === 'login';
  const [searchRegion, setSearchRegion] = useState({city: '', district: ''});
  const [selectRegion, setSelectRegion] = useReducer((state, action) => {
    switch (action.type) {
      case 'CITY':
        return {"city": action.id, "district": null, "rt_rw": null};
      case 'DISTRICT':
        return {...state, "district": action.id, "rt_rw": null};
      case 'RT_RW':
        return {...state, "rt_rw": action.id};
    }
  }, []);
  const [dataRegion, setDataRegion] = useReducer((state, action) => {
    switch (action.type) {
      case 'CITY':
        return {"city": action.payload, "district": null, "rt_rw": null};
      case 'DISTRICT':
        return {...state, "district": action.payload, "rt_rw": null};
      case 'RT_RW':
        return {...state, "rt_rw": action.payload};
      default:
        return state;
    }
  }, []);
  const debouncedSearchCity = useDebounce(searchRegion.city, 500);
  const debouncedSearchDistrict = useDebounce(searchRegion.district, 500);

  useEffect(() => {
    if (debouncedSearchCity == '' ) return 
    const fetchDataCity = async () => {
      const res = await GetCity(debouncedSearchCity)
      if (res.success){
        setDataRegion({ type: 'CITY', payload: res.data });
      } else {
        toast.error(res.message)
      }
    }

    fetchDataCity()
  }, [debouncedSearchCity])

  useEffect(() => {
    if (debouncedSearchDistrict == '' || selectRegion.city == null ) return 
    const fetchDataDistrict = async () => {
      // const idCity = '35.71'
      const res = await GetDistrict(debouncedSearchDistrict, selectRegion.city)
      if (res.success){
        setDataRegion({ type: 'DISTRICT', payload: res.data });
      } else {
        toast.error(res.message)
      }
    }

    fetchDataDistrict()
  }, [debouncedSearchDistrict, selectRegion.city])

  useEffect(() => {
    if (selectRegion.district == null ) return 
    const fetchDataRt = async () => {
      // const idCity = '35.71'
      const res = await GetRt(selectRegion.district)
      if (res.success){
        setDataRegion({ type: 'RT_RW', payload: res.data });
      } else {
        toast.error(res.message)
      }
    }

    fetchDataRt()
  }, [selectRegion.district])

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await Register(new FormData(e.target))
    if (res.success) {
      toast.success(res.message)
      window.location.href = "/auth?mode=login"
    } else {
      toast.error(res.message)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const res = await Login(new FormData(e.target))
    if (res.success) {
      toast.success(res.message)
      window.location.href = "/dashboard"
    } else {
      toast.error(res.message)
    }
  };
  
  const loginFields = [
    { name: "email", label: "Email", type: "email", placeholder: "eco@gemicraft.com", icon: Mail },
    { name: "password", label: "Password", type: "password", placeholder: "••••••••", icon: Lock },
  ];

  const registerFields = [
    { name: "fullname", label: "Nama Lengkap", type: "text", placeholder: "Budi Santoso", icon: User },
    { name: "email", label: "Email", type: "email", placeholder: "eco@gemicraft.com", icon: Mail },
    { name: "phone", label: "Nomor WhatsApp", type: "tel", placeholder: "0812xxxx", icon: Phone,  },
    { name: "kota", 
      label: "Kota/Kabupaten", 
      type: "text", 
      placeholder: "Cari Lokasi Anda", 
      icon: MapPin, 
      onChange: (e) => setSearchRegion(prev => ({ ...prev, city: e.target.value })), 
      onClick: (id) => setSelectRegion({ type: 'CITY', id: id }), 
      data : dataRegion.city, 
      isAutoComplete: true 
    },
    { name: "kelurahan-kecamatan", 
      label: "Kelurahan-Kecamatan", 
      type: "text", 
      placeholder: "Cari Lokasi Anda", 
      icon: MapPin, 
      onChange: (e) => setSearchRegion(prev => ({ ...prev, district: e.target.value })), 
      onClick: (id) => setSelectRegion({ type: 'DISTRICT', id: id }), 
      data: dataRegion.district, 
      isAutoComplete: true 
    },
    { name: "area", label: "RT/RW / Lokasi", type: "select", placeholder: "Pilih Lokasi Anda", icon: MapPin, data: dataRegion.rt_rw },
    { name: "password", label: "Password", type: "password", placeholder: "Minimal 8 karakter", icon: Lock },
  ];

  const currentFields = isLogin ? loginFields : registerFields;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-emerald-900/5 p-8 md:p-10 border border-slate-100">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4 shadow-lg shadow-emerald-200">
            <span className="text-white font-black text-2xl">G</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isLogin ? "Selamat Datang Kembali!" : "Bergabung Sekarang"}
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium text-balance">
            {isLogin 
              ? "Masuk untuk melanjutkan transformasi sampah jadi cuan." 
              : "Mulai langkah kecilmu untuk bumi yang lebih hijau."}
          </p>
        </div>

        {/* Form Dinamis */}
        <form className="space-y-5" onSubmit={isLogin ? handleLogin : handleRegister}>
          {currentFields.map((field, index) => (
            <AuthInput key={index} {...field} />
          ))}

          {isLogin && (
            <div className="flex justify-end">
              <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Lupa Password?</button>
            </div>
          )}

          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
            {isLogin ? "Masuk ke Dashboard" : "Buat Akun Gemicraft"}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Social Sign-in Section */}
        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-4 text-xs font-semibold text-slate-400 uppercase tracking-widest absolute">Atau</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-bold text-slate-600">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-bold text-slate-600">
              <Github size={20} className="text-slate-800" />
              Github
            </button>
          </div>
        </div>

        {/* Switch Link */}
        <p className="text-center mt-10 text-sm text-slate-500 font-medium">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <button className="text-emerald-600 font-bold hover:underline">
            <Link href={isLogin ? "/auth?mode=register" : "/auth?mode=login"}>
              {isLogin ? "Daftar di sini" : "Login di sini"}
            </Link>
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;