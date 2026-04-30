'use client'
import { useState, useReducer, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
import { Hammer, Leaf, PencilIcon, User, Phone, MapPin, Lock, Save, ChevronDown, Check } from 'lucide-react';

import { NumberFormater } from '@/app/components/shared/numberFormater';
import GetRegion from '@/app/services/dashboard/getRegion';
import GetCity from '@/app/services/dashboard/getCity';
import GetDistrict from '@/app/services/dashboard/getDistrict';
import GetRt from '@/app/services/dashboard/getRt';
import useDebounce from '@/app/components/shared/debouncedFunction';
import UpdateProfiles from '@/app/services/dashboard/updateProfiles';
import GetCarbonFootprint from '@/app/services/dashboard/getCarbonFootprint';
import GetLeaderboard from '@/app/services/leaderboard/getLeaderboard';

const Dashboard = () => {
    const { profile } = useUser();

    const timeofDay = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "pagi";
        else if (hour < 18) return "siang";
        else return "malam";
    }

    const [profileData, setProfileData] = useReducer((state, action) => {
        switch (action.type) {
            case 'INITIAL':
                return ({...profile, ...action.data, carbon_footprint: action.dataCarbon, status_rt_rank: action.dataRank })
            case 'UPDATE':
                return { ...state, [action.field]: action.value };
            case 'CITY' :
                return ({...state, kota_kab_selected: action.data, kelurahan_kecamatan_selected: null, kelurahan_kecamatan_data: null, rt_rw_data:null, rt_rw_selected: null})
            case 'DISTRICT' :
                return ({...state, kelurahan_kecamatan_selected: action.data, rt_rw_data: null, rt_rw_selected: null})
            case 'RTRW' :
                return ({...state, rt_rw_selected: action.data})
            case 'CITYDATA' :
                return ({...state, kota_kab_data: action.data})
            case 'DISTRICTDATA' :
                return ({...state, kelurahan_kecamatan_data: action.data})
            case 'RTRWDATA' :
                return ({...state, rt_rw_data: action.data})
            default :
                return state
        }
    }, profile)
    
    const [editMode, setEditMode] = useState(false)
    const [searchRegion, setSearchRegion] = useState({'CITY': '', 'DISTRICT': ''});
    const [isDropdown, setIsDropdown] = useState({'CITY': null, 'DISTRICT': null})
    const debouncedSearchCity = useDebounce(searchRegion.CITY, 500)
    const debouncedSearchDistrict = useDebounce(searchRegion.DISTRICT, 500)

    const handleSearch = (e, mode) => {
        setProfileData({ type: mode, data: {id: null, name: e.target.value} })
        setSearchRegion((prev) => ({...prev, [mode]:e.target.value}))
        setIsDropdown((prev) => ({...prev, [mode]:true}))
    }
    
    const handleSelect = (mode, item) => {
        setProfileData({ type: mode, data: {id: item.id, name: item.name} })
        setSearchRegion(prev => ({ ...prev, [mode]: item.name }));
        setIsDropdown((prev) => ({...prev, [mode]:false}))
    }

    const handleUpdateProfiles = async (e) => {
        e.preventDefault()
        const res = await UpdateProfiles(profileData)

        if(res.success){
            toast.success(res.message)
            window.location.reload()
        } else {
            toast.error('Gagal mengupdate profiles:', res.message)
        }
    }
    
    useEffect(() => {
        if (editMode) return
        const fetchInitial = async () => {
            const res = await GetRegion(profile?.rt_id)
            const resCarbon = await GetCarbonFootprint(profile.id)
            const resRank = await GetLeaderboard(profile.rt_id, true)
            console.log(resRank)
            if (res.success && resCarbon.success && resRank.success){
                setProfileData({type: "INITIAL", data: res.data, dataCarbon: resCarbon.data, dataRank: resRank.data})
            } else {
                toast.error(
                    "Gagal meminta data:\n\n" +
                    "- Region: " + (res.message || "Error tidak diketahui") + "\n" +
                    "- Carbon: " + (resCarbon.message || "Error tidak diketahui") + "\n" +
                    "- Rank: " + (resRank.message || "Error tidak diketahui")
                )
            }
        }
        fetchInitial()
    }, [profile, editMode])

    useEffect(() => {
        if (!debouncedSearchCity || !isDropdown.CITY) return
        const fetchCity = async () => {
            const res = await GetCity(debouncedSearchCity)
            if (res.success){
                setProfileData({type: "CITYDATA", data: res.data})
            } else {
                toast.error('Gagal mencari data kota yang sesuai',res.message)
            }
        }
        fetchCity()
    }, [debouncedSearchCity])

    useEffect(() => {
        if (!debouncedSearchDistrict || !isDropdown.DISTRICT) return
        const fetchCity = async () => {
            const res = await GetDistrict(debouncedSearchDistrict, profileData?.kota_kab_selected?.id)
            if (res.success){
                setProfileData({type: "DISTRICTDATA", data: res.data})
            } else {
                toast.error('Gagal mencari data kecamatan/kelurahan yang sesuai',res.message)
            }
        }
        fetchCity()
    }, [debouncedSearchDistrict])

    useEffect(() => {
        if (!profileData?.kelurahan_kecamatan_selected?.id) return
        const fetchCity = async () => {
            const res = await GetRt(profileData.kelurahan_kecamatan_selected.id)
            if (res.success){
                setProfileData({type: "RTRWDATA", data: res.data})
            } else {
                toast.error('Gagal mencari data rt/rw yang sesuai',res.message)
            }
        }
        fetchCity()
    }, [profileData?.kelurahan_kecamatan_selected?.id])

    const registerFields = useMemo(() => [
    { name: "name", 
      label: "Nama Lengkap", 
      type: "text", 
      placeholder: "Budi Santoso", 
      icon: User, 
      selectedValue:profileData.name },
    { name: "phone_number", 
      label: "Nomor WhatsApp", 
      type: "tel", 
      placeholder: "0812xxxx", 
      icon: Phone, 
      selectedValue:profileData.phone_number  },
    { name: "kota_kab", 
      label: "Kota/Kabupaten", 
      type: "text", 
      placeholder: "Cari Lokasi Anda", 
      icon: MapPin,  
      mode: "CITY" ,
      data : profileData?.kota_kab_data, 
      isAutoComplete: true,
      selectedValue:profileData.kota_kab_selected,
    },
    { name: "kelurahan_kecamatan", 
      label: "Kelurahan-Kecamatan", 
      type: "text", 
      placeholder: "Cari Lokasi Anda", 
      icon: MapPin, 
      mode: 'DISTRICT',
      data: profileData.kelurahan_kecamatan_data,
      isAutoComplete: true,
      selectedValue: profileData.kelurahan_kecamatan_selected,
      disabled:!profileData.kota_kab_selected?.id
    },
    { name: "rt_rw_selected", 
      label: "RT/RW / Lokasi", 
      type: "select", 
      placeholder: "Pilih Lokasi Anda", 
      icon: MapPin, 
      mode: 'RTRW',
      selectedValue: profileData.rt_rw_selected,  
      data:profileData.rt_rw_data,
      disabled:!profileData.kelurahan_kecamatan_selected?.id
    },
    { name: "password", 
      label: "Password", 
      type: "password", 
      placeholder: "Minimal 8 karakter", 
      icon: Lock },
    ], [profileData, isDropdown])

  return (
     
      <div className="relative flex flex-col min-h-screen bg-slate-50 text-slate-900 pb-20">

        <header className="p-6 bg-white shadow-sm rounded-b-3xl">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <p className="text-lg text-slate-500">Selamat {timeofDay()},</p>
                    <h1 className="text-2xl font-bold text-emerald-700">{profile?.name || "Eco Warrior"}! 👋</h1>
                </div>
                <div className="bg-emerald-100 p-2 rounded-full">
                    <Leaf className="text-emerald-600" size={24} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-l from-teal-700 to-emerald-600 p-4 rounded-2xl text-white">
                    <p className="text-md opacity-80">Total Poin</p>
                    <p className="text-2xl font-bold">{NumberFormater(profile?.total_individual_points) || 0}</p>
                </div>
                <div className="bg-gradient-to-r from-teal-700 to-emerald-600 p-4 rounded-2xl text-white">
                    <p className="text-md opacity-80">CO2 Dicegah</p>
                    <p className="text-2xl font-bold">{NumberFormater(profileData.carbon_footprint)} kg</p>
                </div>
            </div>
        </header>

        <main className="p-6 space-y-6">
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-700 p-6 rounded-3xl shadow-lg text-white">
                <div className="relative z-10">
                    <h2 className="text-xl font-bold mb-2">Punya sampah di rumah?</h2>
                    <p className="text-sm opacity-90 mb-4">Ubah sampah menjadi karya bernilai cuan dengan bantuan gemicraft!</p>
                    <Link  href={'/project'}>
                        <button 
                        className="flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold shadow-md active:scale-95 transition-transform"
                        >
                            <Hammer size={20}/>
                            Mulai atau Lanjutkan Project
                        </button>
                    </Link>
                </div>
                <Hammer className="absolute -right-4 -bottom-4 text-emerald-300 opacity-20" size={150} />
            </section>

                {/* RT Leaderboard Banner */}
            <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-xl">Status Peringkat RT</h3>
                    <span className="text-sm font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded-md">Rank #{profileData?.status_rt_rank?.userRt?.rank || 0}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                    style={{ width: `${profileData?.status_rt_rank?.percentage}%`}}
                    className={`bg-amber-400 h-full `}></div>
                </div>
                <p className="text-sm text-slate-500 mt-2">{NumberFormater(profileData?.status_rt_rank?.gapPoints)} poin lagi untuk naik peringkat {profileData?.status_rt_rank?.upperRt?.rank || 0}!</p>
            </section>
            
            {profileData ? 
            (<section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <button 
                className={`flex justify-center items-center gap-2 rounded-xl py-2 px-4 font-semibold  ${editMode ? 'text-emerald-600 border-2 border-emerald-600' : 'text-red-600  border-2 border-red-600'}  `}
                onClick={() => setEditMode(!editMode)}>
                    EDIT <PencilIcon size={16}/>
                </button>
                <form className="space-y-6" >
                    <fieldset disabled={!editMode} >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {registerFields.map((field, idx) => (
                                <div key={idx} className={`space-y-2 relative ${field.name === 'fullname' || field.name === 'password' ? 'md:col-span-2' : ''}`}>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                    {field.label}
                                </label>
                                
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                                    {field.icon && <field.icon size={18} />}
                                    </div>

                                    {field.type === 'select' ? (
                                    <div className="relative">
                                        <select
                                        disabled={field.disabled}
                                        name={field.name}
                                        value={field?.selectedValue?.id}
                                        onChange={(e) => setProfileData({
                                            type:field.mode,
                                            data:{ id: e.target.value, name: e.target.options[e.target.selectedIndex].text }
                                        })}
                                        className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl appearance-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-700"
                                        >
                                            <option value="">{field.placeholder}</option>
                                            {field?.data?.map((item, i) => (
                                                <option key={i} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                    </div>
                                    ) : (
                                    field.isAutoComplete ? (
                                        <input
                                            disabled={field.disabled}
                                            type={field.type}
                                            name={field.name}
                                            placeholder={field.placeholder}
                                            value={field?.selectedValue?.name || ''}
                                            autoComplete={field.type === 'password' ? 'new-password' : 'one-time-code'}
                                            onChange={(e) => {handleSearch(e, field.mode)}}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-700"
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            placeholder={field.placeholder}
                                            value={field?.selectedValue}
                                            autoComplete={field.type === 'password' ? 'new-password' : 'one-time-code'}
                                            onChange={(e) => setProfileData({ 
                                                                type: 'UPDATE', 
                                                                field: e.target.name, 
                                                                value: e.target.value 
                                                            })}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-700"
                                        />
                                    )
                                    )}
                                </div>

                                {field.isAutoComplete && field.data && isDropdown[field.mode] && (
                                    <ul className="absolute z-30 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-40 overflow-y-auto py-2 animate-in fade-in slide-in-from-top-2">
                                    {field.data.map((item) => (
                                        <li 
                                        key={item.id}
                                        onClick={() => handleSelect(field.mode, item)}
                                        className="px-5 py-3 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer flex justify-between items-center transition-colors"
                                        >
                                            {`${item.name}`}
                                            <Check size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100" />
                                        </li>
                                    ))}
                                    </ul>
                                )}
                                </div>
                            ))}
                            </div>

                            <div className="pt-6">
                            <button 
                                type="button"
                                onClick={(e) => handleUpdateProfiles(e)}
                                className="w-full py-4 bg-emerald-600 text-white rounded-[1.5rem] font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                <Save size={20} /> Simpan Perubahan Identitas
                            </button>
                            <p className="text-center text-[10px] text-slate-400 font-medium mt-4 px-6">
                                Pastikan pemilihan lokasi RT/RW sesuai agar poin dampak lingkungan Anda terakumulasi dengan benar di sistem leaderboard [2, 3].
                            </p>
                        </div>
                    </fieldset>
                </form>
            </section>) : (<></>)
            }
            
        </main>
    </div>

);
};

export default Dashboard;