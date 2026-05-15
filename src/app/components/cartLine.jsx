import {Minus, Plus, Trash2, CirclePlus} from "lucide-react";
import { PriceFormater } from "./shared/numberFormater";

export default function CartLine ({ item, onMinus, onPlus, onRemove, isSelected, onToggleSelected }) {
  return (
    <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm">
      <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="w-full md:h-45 md:w-45 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 font-black">IMG</div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="min-w-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                {item.materialCategory}
              </p>
              <h3 className="font-black text-sm text-slate-800 truncate">{item.title}</h3>
              <p className="mt-2 text-custom-third font-black text-sm">{PriceFormater(item.price)}</p>
          </div>

          <div className="mt-4 flex flex-col items-start text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</p>
            <p className="font-black text-slate-800">{PriceFormater(item.price * item.amount)}</p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onMinus(item.id)}
                className="w-10 h-10 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 transition flex items-center justify-center"
                aria-label="Kurangi jumlah"
              >
                <Minus size={18} className="text-slate-700" />
              </button>

              <div className="min-w-[44px] text-center py-2 px-3 rounded-2xl border border-slate-200 bg-slate-50">
                <div className="text-sm font-black text-slate-800">{item.amount}</div>
                <div className="text-[10px] font-bold text-slate-400 -mt-1">amount</div>
              </div>

              <button
                type="button"
                onClick={() => onPlus(item.id)}
                className="w-10 h-10 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 transition flex items-center justify-center"
                aria-label="Tambah jumlah"
              >
                <Plus size={18} className="text-slate-700" />
              </button>
            </div>

            <div className="flex gap-2  items-start">
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="p-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 transition"
                aria-label="Hapus item"
                title="Hapus item"
              >
                <Trash2 size={18} />
              </button>

              <button
                type="button"
                onClick={() => onToggleSelected(item.id)}
                className={`
                  p-2 rounded-xl border hover:scale-105 transition
                  ${isSelected ? "bg-custom-second border-custom-first text-custom-third" : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"}`}
                aria-label="Tambah Checkout"
                title="Tambah Checkout"
              ><CirclePlus size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};