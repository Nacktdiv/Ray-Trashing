import React, { useState, useRef, useEffect } from 'react';
import { set } from 'zod';

export default function Auth({ label, type, placeholder, icon: Icon, value, onChange, onClick, name, data, isAutoComplete }) {
  const isSelect = type === "select";
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [visualValue, setVisualValue] = useState({value, iValue: value});
  const containerRef = useRef(null);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (containerRef.current && !containerRef.current.contains(event.target)) {
  //       console.log(containerRef.current, event.target)
  //       setShowSuggestions(false)
  //       if (isAutoComplete) setVisualValue(prev => ({...prev, value : prev.iValue})) 
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  const handleInputChange = (e) => {
    if (onChange) onChange(e); 
    setShowSuggestions(true); 
    setVisualValue(prev => ({ ...prev, value: e.target.value })); 
  };

  const handleItemClick = (item) => {
    onClick(item.id); 
    setShowSuggestions(false);
    setVisualValue(prev => ({ ...prev, value: item.nama_lengkap || item.nama,  iValue: item.nama_lengkap || item.nama})); // Tampilkan nama di input setelah pilih
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors z-10">
          {Icon && <Icon size={18} />}
        </div>

        {isSelect ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm appearance-none cursor-pointer"
          >
            <option value="" disabled>{placeholder}</option>
            {data?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.rt_number} / {item.rw_number}
              </option>
            ))}
          </select>
        ) : (
          <>
            <input
              type={type}
              name={name}
              value={visualValue?.value || ''} 
              onChange={handleInputChange} 
              onFocus={() => {
                if (value?.length > 0) setShowSuggestions(true);
              }}
              placeholder={placeholder}
              autoComplete="off"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
            />

            {isAutoComplete && showSuggestions && data?.length > 0 && (
              <ul className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto py-2 animate-in fade-in zoom-in-95 duration-200">
                {data.map((item) => (
                  <li 
                    key={item.id} 
                    onClick={() => handleItemClick(item)} 
                    className="px-4 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors border-b border-slate-50 last:border-none"
                  >
                    {item.nama_lengkap || item.nama}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        {isSelect && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

