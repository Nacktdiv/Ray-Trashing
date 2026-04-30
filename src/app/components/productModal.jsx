import React from 'react';
import { 
  X, 
  MessageCircle, 
  Tag, 
  User, 
  MapPin, 
  ExternalLink, 
  Leaf, 
  Share2 
} from 'lucide-react';

const ProductDetailModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const waLink = `https://wa.me/${product.whatsapp}?text=Halo%20${product.name},%20saya%20tertarik%20dengan%20karya%20${product.title}%20di%20Gemicraft!`;

  const location = `${product.kota_kab}/${product.provinsi}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pb-21 p-4 bg-slate-900/70 backdrop-blur-md transition-all">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[80vh] flex flex-col">
        
        <div className="relative h-52 md:h-80 shrink-0">
          <img 
            src={product.final_image_url} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 left-6 flex gap-2">
            <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              {product.material_category || "Recycled"}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-all border border-white/30"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
                {product.title}
              </h2>
              <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
                <Leaf size={14} />
                <span>Terbuat dari Sampah Terpilih</span>
              </div>
            </div>
            <div className="bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100 shrink-0">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1 text-center">Harga Karya</p>
              <p className="text-2xl font-black text-emerald-700">{product.price || "Hubungi Penjual"}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-inner">
                <User size={24} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pembuat Kreatif</p>
                <p className="text-sm font-black text-slate-800">{product.name || "Warga Gemicraft"}</p>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Lokasi RT/RW</p>
                <p className="text-sm font-black text-slate-800">{location || "Wilayah Komunitas"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Tag size={14} className="text-emerald-500" /> Cerita Di Balik Karya
            </h4>
            <div className="bg-white border-l-4 border-emerald-200 pl-4 py-1">
              <p className="text-slate-600 leading-relaxed text-sm italic">
                {product.description || "Pembuat belum menambahkan deskripsi untuk karya luar biasa ini."}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a 
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 bg-[#25D366] text-white rounded-[1.5rem] font-bold shadow-lg shadow-green-200 hover:bg-[#20bd5a] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <MessageCircle size={22} />
              Hubungi Penjual via WA
              <ExternalLink size={16} className="opacity-70" />
            </a>
            <button className="px-6 py-4 bg-slate-100 text-slate-600 rounded-[1.5rem] font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;