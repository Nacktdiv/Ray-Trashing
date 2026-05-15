import { useState, useReducer, useEffect } from "react";
import toast from 'react-hot-toast';
import { TrendingUp, Search } from "lucide-react"
import ProductDetailModal from "@/app/components/productModal";
import GetProducts from '@/app/services/showcase/getProduct';
import { useUser } from "@/context/UserContext";

export default function ExploreMode() {
    const { profile } = useUser();

    const [products, setProducts] = useReducer((state, action) => {
        switch (action.type) {
        case "INITIAL":
            return  action.data
        case "SEARCH":
            return
        }
    })
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleOpenEdit = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
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
            <div className="flex items-center gap-2 text-emerald-700">
              <TrendingUp size={18} />
              <h2 className="font-bold">Populer Minggu Ini</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 group">
              {products?.map(item => (
                <div 
                key={item.product_id} 
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
    )
}