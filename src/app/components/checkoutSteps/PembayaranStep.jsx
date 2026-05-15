"use client";
import { useMemo } from "react";
import { ShoppingBag, Store, MapPin, CreditCard } from "lucide-react";
import { PriceFormater } from "../shared/numberFormater";

export default function PembayaranStep({ onBack, onNext, orderData }) {
  // --- Kalkulasi Total Keseluruhan ---
  const totals = useMemo(() => {
    if (!orderData) return { gross: 0, shipping: 0, discount: 0, final: 0 };
    return orderData.reduce((acc, curr) => ({
      gross: acc.gross + (curr.gross_total || 0),
      shipping: acc.shipping + (curr.shipping_cost || 0),
      discount: acc.discount + (curr.voucher_discount || 0),
      final: acc.final + (curr.subtotal || 0),
    }), { gross: 0, shipping: 0, discount: 0, final: 0 });
  }, [orderData]);

  if (!orderData || orderData.length === 0) return null;

  // Mengambil data penerima dari group pertama (asumsi alamat sama semua)
  const receiver = orderData[0];

  return (
    <div className="space-y-6">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
        
        {/* --- SECTION 1: PER TOKO (MAPPING) --- */}
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Rincian Per Toko</p>
          {orderData.map((shop, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-[1.5rem] p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-50">
                <Store size={14} className="text-custom-third" />
                <span className="text-xs font-black text-slate-800 uppercase">{shop.sender_name}</span>
              </div>
              
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Harga Produk</span>
                  <span className="font-black text-slate-800">{PriceFormater(shop.gross_total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Ongkir ({shop.shipping_method})</span>
                  <span className="font-black text-slate-800">{PriceFormater(shop.shipping_cost)}</span>
                </div>
                {shop.voucher_discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Diskon Voucher</span>
                    <span className="font-black text-emerald-500">-{PriceFormater(shop.voucher_discount)}</span>
                  </div>
                )}
                <div className="pt-2 mt-2 border-t border-dashed border-slate-100 flex justify-between items-center">
                  <span className="font-black text-slate-800">Subtotal Toko</span>
                  <span className="text-sm font-black text-custom-third">{PriceFormater(shop.subtotal)}</span>
                </div>
                
                {shop.message && (
                  <div className="mt-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase font-black">Catatan:</p>
                    <p className="italic text-slate-600">"{shop.message}"</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* --- SECTION 2: RINGKASAN TOTAL --- */}
        <div className="bg-slate-800 rounded-[2rem] p-5 text-white shadow-xl space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag size={18} className="text-custom-first" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Pembayaran</p>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between opacity-80">
              <span>Total Harga Produk</span>
              <span>{PriceFormater(totals.gross)}</span>
            </div>
            <div className="flex justify-between opacity-80">
              <span>Total Ongkos Kirim</span>
              <span>{PriceFormater(totals.shipping)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Total Potongan</span>
                <span>-{PriceFormater(totals.discount)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-slate-700 flex justify-between items-center">
              <span className="font-black uppercase tracking-tighter">Total Akhir</span>
              <span className="text-xl font-black text-custom-first">{PriceFormater(totals.final)}</span>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: ALAMAT & METODE --- */}
        <div className="bg-white border border-slate-200 rounded-[1.5rem] p-4 space-y-4">
          <div className="flex gap-3">
            <div className="p-2 bg-slate-100 rounded-full h-fit">
              <MapPin size={16} className="text-slate-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Alamat Pengiriman</p>
              <p className="text-xs font-black text-slate-800">{receiver.receiver_name} <span className="font-bold text-slate-500">({receiver.receiver_phone})</span></p>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{receiver.destination_address}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-slate-50">
            <div className="p-2 bg-slate-100 rounded-full h-fit">
              <CreditCard size={16} className="text-slate-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Metode Pembayaran</p>
              <p className="text-xs font-black text-custom-third uppercase italic">{receiver.payment_method}</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- NAVIGASI --- */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={onBack}
          className="flex-1 px-5 py-4 rounded-[1.5rem] bg-white text-slate-400 font-black text-xs border border-slate-200 hover:bg-slate-50 transition"
        >
          KEMBALI
        </button>
        <button
          onClick={onNext}
          className="flex-[2] px-5 py-4 rounded-[1.5rem] bg-custom-third text-white font-black text-sm shadow-lg shadow-custom-third/20 active:scale-95 transition"
        >
          BUAT PESANAN SEKARANG
        </button>
      </div>
    </div>
  );
}