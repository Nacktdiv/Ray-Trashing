'use client'
import { useState } from 'react';
import { 
  UserCircle, 
  Globe, 
} from 'lucide-react';
import ExploreMode from './exploreMode';
import MarketProfileMode from './marketProfileMode';
import CartMode from './cartMode';
import TransactionMode from './transactionMode';

const GreenShowcaseV2 = () => {

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

  const [viewMode, setViewMode] = useState('explore'); // 'explore' | 'profile' | 'transaction' | 'cart'


  return (
    <div className="min-h-screen bg-slate-50 pb-28">

      <header className="bg-white p-6 shadow-sm sticky top-0 z-30">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-black text-emerald-800 tracking-tight">Showcase</h1>

          {/* Desktop buttons */}
          <div className="hidden md:flex gap-4 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode("transaction")}
              className={`p-2 md:px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === "transaction" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"
              }`}
            >
              <UserCircle size={16} /> Transaction
            </button>

            <button
              onClick={() => setViewMode("cart")}
              className={`p-2 md:px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === "cart" ? "bg-white text-amber-600 shadow-sm" : "text-slate-400"
              }`}
            >
              <UserCircle size={16} /> Cart
            </button>

            <button
              onClick={() => setViewMode("explore")}
              className={`p-2 md:px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === "explore" ? "bg-white text-purple-600 shadow-sm" : "text-slate-400"
              }`}
            >
              <Globe size={16} /> Explore
            </button>

            <button
              onClick={() => setViewMode("profile")}
              className={`p-2 md:px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === "profile" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
              }`}
            >
              <UserCircle size={16} /> Market Profile
            </button>
          </div>

          {/* Mobile dropdown */}
          <div className="md:hidden w-[170px]">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-custom-second/20"
              aria-label="Pilih mode showcase"
            >
              <option value="profile">Market Profile</option>
              <option value="explore">Explore</option>
              <option value="cart">Cart </option>
              <option value="transaction">Transaction </option>
            </select>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="p-6">
      {
        {
          'explore': <ExploreMode />,
          'profile': <MarketProfileMode />,
          'transaction': <TransactionMode/>,
          'cart': <CartMode />
        }[viewMode] || <ExploreMode />
      }
      </main>
    </div>
  );
};

export default GreenShowcaseV2;
