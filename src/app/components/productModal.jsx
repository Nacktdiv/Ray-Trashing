import React, { useState } from 'react';
import { 
  X, 
  Tag, 
  User, 
  MapPin, 
  Leaf, 
  Share2,
  ShoppingCart,
  Plus,
  Minus
} from 'lucide-react';
import CreateCart from '../services/showcase/carts/createCart';
import { useUser } from '@/context/UserContext';
import toast from 'react-hot-toast';

const ProductDetailModal = ({ isOpen, onClose, product}) => {
  const { profile } = useUser()
  const [amount, setAmount] = useState(1);

  if (!isOpen || !product) return null;

  const location = `${product.kota_kab}/${product.provinsi}`;

  const handleAddClick = async () => {
    const res = await CreateCart(amount, profile.id, product.product_id)
    if(res.success) {
      toast.success("Success Creating Carts: ", res.message)
    } else {
      toast.error("Error Creating Carts: ", res.message)
    }
  };

  return (
    // Tambahkan p-2 atau p-4 agar modal tidak mentok ke pinggir layar HP
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 pb-17 bg-slate-900/70 backdrop-blur-md transition-all">
      
      {/* Mobile: Slide up (items-end) atau Center (items-center) 
         Desktop: Tetap di tengah dengan max-w-2xl
      */}
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-300 max-h-[80vh] md:max-h-[85vh] flex flex-col">
        
        {/* Image Section: Tinggi dinamis agar tidak memakan layar HP berlebihan */}
        <div className="relative h-48 sm:h-64 md:h-80 shrink-0">
          <img 
            src={product.final_image_url} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
          
          {/* Tag Material: Dibuat lebih kecil di mobile */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 flex gap-2">
            <span className="bg-custom-third/90 backdrop-blur-md text-white text-[9px] md:text-[10px] font-black px-2.5 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              {product.material_category || "Recycled"}
            </span>
          </div>

          {/* Close Button: Lebih mudah dijangkau */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-black/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-all border border-white/30"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Section: Padding lebih kecil di mobile agar tidak sempit */}
        <div className="p-5 md:p-8 overflow-y-auto custom-scrollbar space-y-6 md:space-y-8">
          
          {/* Title & Price: Flex wrap otomatis */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl md:text-3xl font-black text-custom-alter leading-tight uppercase">
                {product.title}
              </h2>
              <div className="flex items-center gap-2 text-custom-third font-medium text-xs md:text-sm">
                <Leaf size={14} />
                <span>Selected Waste Material</span>
              </div>
            </div>
            
            <div className="bg-custom-first/40 px-4 py-2 md:px-5 md:py-3 rounded-2xl border border-custom-first flex md:flex-col items-center justify-between md:justify-center shrink-0">
              <p className="text-[9px] md:text-xs font-bold text-custom-second uppercase tracking-widest md:mb-1">Price</p>
              <p className="text-xl md:text-2xl font-black text-custom-third">{product.price}</p>
            </div>
          </div>

          {/* Info Cards: Grid 1 kolom di HP, 2 kolom di Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 p-4 md:p-5 bg-custom-first/40 rounded-[2rem] border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-custom-third rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-inner">
                <User size={20} className="md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-[9px] text-custom-alter/60 font-bold uppercase tracking-widest">Maker</p>
                <p className="text-xs md:text-sm font-black text-custom-alter truncate max-w-[150px]">{product.name || "Warga Gemicraft"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-custom-second rounded-xl md:rounded-2xl flex items-center justify-center text-white">
                <MapPin size={20} className="md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-[9px] text-custom-alter/60 font-bold uppercase tracking-widest">Location</p>
                <p className="text-xs md:text-sm font-black text-custom-alter truncate max-w-[150px]">{location || "Kediri"}</p>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="space-y-3">
            <h4 className="text-[11px] md:text-sm font-black text-custom-alter uppercase tracking-[0.2em] flex items-center gap-2">
              <Tag size={16} className="text-custom-third" /> Story Behind the Art
            </h4>
            <div className="bg-slate-50 rounded-2xl p-4 border-l-4 border-custom-second">
              <p className="text-custom-alter leading-relaxed text-xs md:text-sm italic opacity-80">
                {product.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Action Footer: Sticky/Fixed di bawah modal */}
          <div className="sticky bottom-0 bg-white py-2 px-4 rounded-full border border-custom-second shadow-md shadow-custom-second flex flex-col gap-3">
            <div className="flex flex-row gap-3">
              {/* Amount Selector: Dibuat lebih compact di mobile */}
              <div className="flex items-center justify-between bg-slate-100 rounded-2xl p-1 md:p-1.5 min-w-[110px] md:min-w-[140px]">
                <button 
                  onClick={() => setAmount(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-lg md:rounded-xl text-custom-alter shadow-sm active:scale-90 transition"
                >
                  <Minus size={16} />
                </button>
                <span className="font-black text-custom-alter text-sm md:text-lg px-2 md:px-4">{amount}</span>
                <button 
                  onClick={() => setAmount(prev => prev + 1)}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-lg md:rounded-xl text-custom-alter shadow-sm active:scale-90 transition"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart: Lebar penuh sisa space */}
              <button 
                onClick={handleAddClick}
                className="flex-1 py-3 md:py-4 bg-custom-third text-white rounded-2xl md:rounded-[1.5rem] font-black text-xs md:text-sm shadow-lg shadow-custom-third/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} className="md:w-5 md:h-5" />
                ADD TO CART
              </button>

              {/* Share Button: Hanya muncul di desktop/layar agak lebar kalau mau hemat tempat */}
              <button className="hidden sm:flex px-4 md:px-6 py-3 md:py-4 bg-slate-100 text-custom-alter rounded-2xl md:rounded-[1.5rem] font-bold hover:bg-slate-200 transition-all items-center justify-center">
                <Share2 size={20} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;