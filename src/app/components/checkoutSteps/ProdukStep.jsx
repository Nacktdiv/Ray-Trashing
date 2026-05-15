"use client";
import { useEffect, useMemo, useState } from "react";
import { PriceFormater } from "../shared/numberFormater";
import { Truck } from "lucide-react";

const SHIPPING_OPTIONS = [
  { key: "REG", label: "Reguler", eta: "2-4 hari", cost: 15000 },
  { key: "ECO", label: "Ekonomis", eta: "3-6 hari", cost: 10000 },
  { key: "EXP", label: "Express", eta: "1-2 hari", cost: 25000 },
];

const VOUCHERS = [
  { key: "NONE", label: "Tanpa Voucher", kind: "none" },
  { key: "SAVE10", label: "SAVE10 (10%)", kind: "percent", percent: 10, maxDiscount: 25000 },
  { key: "HEMAT20", label: "HEMAT20 (Rp 20k)", kind: "fixed", fixed: 20000, maxDiscount: 20000 },
];

function getShippingCost(shippingKey) { // untuk mencari apakah shipping option yang dipilih memiliki cost/biaya
  const found = SHIPPING_OPTIONS.find((o) => o.key === shippingKey);
  return found ? found.cost : SHIPPING_OPTIONS[0].cost;
}

function getShippingLabel(shippingKey) { // untuk mencari detail nama dari key shipping option Semisal REG = "Reguler"
  const found = SHIPPING_OPTIONS.find((o) => o.key === shippingKey);
  return found ? found.label : SHIPPING_OPTIONS[0].label;
}

function getVoucherSpec(voucherKey) { // untuk mencari apakah voucher option yang dipilih ada
  return VOUCHERS.find((v) => v.key === voucherKey) ?? VOUCHERS[0];
}

function getVoucherDiscount({ voucherKey, subtotal }) { // untuk mencari voucher yang dipilih dan mengubah nilai subtotal jadi setelah dikurangi voucher
  const selectedVoucher = getVoucherSpec(voucherKey);
  if (selectedVoucher.kind === "none") return 0;
  if (selectedVoucher.kind === "percent") {
    const raw = Math.floor((subtotal * selectedVoucher.percent) / 100);
    return Math.min(raw, selectedVoucher.maxDiscount);
  }
  return Math.min(selectedVoucher.fixed, selectedVoucher.maxDiscount);
}

function ensureShopKeys(map, sellerNames, initialValue) {
  const next = { ...map };
  for (const name of sellerNames) {
    if (next[name] === undefined) next[name] = initialValue;
  }
  return next;
}

export default function ProdukStep({ onBack, onNext, setOrderData, orderData }) {
    const defaultShippingKey = SHIPPING_OPTIONS[0];
    const defaultVoucherKey = VOUCHERS[0];

    const [shippingByShop, setShippingByShop] = useState({});
    const [voucherByShop, setVoucherByShop] = useState({});
    const [messageByShop, setMessageByShop] = useState({});

    useEffect(() => {
        if (!orderData) return;

        orderData.forEach((group) => {
            const name = group.sender_name;

            if (shippingByShop[name] === undefined) {
                const hasSavedShipping = SHIPPING_OPTIONS.find(item => item.key === group.shipping_key);
                setShippingByShop((prev) => ({...prev, [name] : hasSavedShipping ? group.shipping_key : SHIPPING_OPTIONS[0].key}))
            }

            if (voucherByShop[name] === undefined) {
                const hasSavedVoucher = VOUCHERS.find(item => item.key === group.voucher_key);
                setVoucherByShop((prev) => ({...prev, [name] : hasSavedVoucher ? group.voucher_key : VOUCHERS[0].key}))
            }

            if (messageByShop[name] === undefined) {
                setMessageByShop((prev) => ({...prev, [name] : group.message ? group.message : ""}) )
            }
        });

    }, [orderData]);

    const totalsByShop = useMemo(() => {
        if (!orderData) return null;

        return orderData.map((g) => {
            // Ambil Key dari state lokal
            const shopShippingKey = shippingByShop[g.sender_name] || SHIPPING_OPTIONS[0].key;
            const shopVoucherKey = voucherByShop[g.sender_name] || VOUCHERS[0].key;

            const shopShippingCost = getShippingCost(shopShippingKey);
            const shopVoucherDiscount = getVoucherDiscount({
                voucherKey: shopVoucherKey,
                subtotal: g.subtotal,
            });

            return {
                ...g,
                shipping_key: shopShippingKey, // Simpan KEY untuk inisialisasi nanti
                shipping_method: getShippingLabel(shopShippingKey),
                shipping_cost: shopShippingCost,
                voucher_key: shopVoucherKey, // Simpan KEY untuk inisialisasi nanti
                voucher_discount: shopVoucherDiscount,
                // Perhatian: Jangan timpa subtotal asli jika parent butuh harga produk murni
                // Tapi jika parent memang mau subtotal akhir (produk + ongkir - diskon), gunakan ini:
                gross_total : g.subtotal, 
                subtotal: Math.max(0, g.subtotal + shopShippingCost - shopVoucherDiscount),
                message: messageByShop[g.sender_name] ?? "",
            };
        });
    }, [orderData, shippingByShop, voucherByShop, messageByShop]);

    const handleSave = () => {
        setOrderData(totalsByShop)
    }

    if(!totalsByShop) return null;
        
    return (
        <div className="space-y-4">
      <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-4 space-y-4 max-h-[50vh] overflow-y-auto">
        {/* Header UI */}
        <div className="flex items-center gap-2 px-2">
          <Truck size={18} className="text-custom-second" />
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail Produk & Pengiriman</p>
            <p className="font-black text-slate-800 text-sm">Atur opsi tiap toko</p>
          </div>
        </div>

        {totalsByShop.map((shop) => (
          <div key={shop.sender_name} className="bg-white border border-slate-200 rounded-[1.5rem] p-4 space-y-4">
            {/* Nama Toko & Total */}
            <div className="flex justify-between items-start border-b border-slate-50 pb-3">
              <div>
                <p className="text-xs font-black text-slate-800">{shop.sender_name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{shop.items.length} Produk</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase">Subtotal Toko</p>
                <p className="font-black text-custom-third text-sm">{PriceFormater(shop.subtotal)}</p>
              </div>
            </div>

            {/* Opsi Pengiriman (Metode) */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pilih Metode Pengiriman</p>
              <div className="grid grid-cols-1 gap-2">
                {SHIPPING_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setShippingByShop(prev => ({ ...prev, [shop.sender_name]: option.key }))}
                    className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                      (shippingByShop[shop.sender_name] ?? defaultShippingKey) === option.key
                      ? "border-custom-third bg-custom-first/30"
                      : "border-slate-100 bg-slate-50 hover:border-slate-200"
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-[11px] font-black text-slate-800">{option.label}</p>
                      <p className="text-[9px] font-bold text-slate-400">{option.eta}</p>
                    </div>
                    <p className="text-xs font-black text-slate-800">{PriceFormater(option.cost)}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Voucher & Pesan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Voucher Toko</p>
                <select
                  value={voucherByShop[shop.sender_name] ?? defaultVoucherKey}
                  onChange={(e) => setVoucherByShop((prev) => ({ ...prev, [shop.sender_name]: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-black outline-none focus:border-custom-third"
                >
                  {VOUCHERS.map((v) => (
                    <option key={v.key} value={v.key}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catatan</p>
                <input
                  value={messageByShop[shop.sender_name] ?? ""}
                  onChange={(e) => setMessageByShop((prev) => ({ ...prev, [shop.sender_name]: e.target.value }))}
                  placeholder="Contoh: Warna merah ya"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-black outline-none focus:border-custom-third"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigasi */}
      <div className="flex items-center justify-between pt-4 px-2">
        <button 
            onClick={() => {
                handleSave()
                onBack()
            }} 
            className="text-xs font-black text-slate-400 hover:text-slate-600 transition"
        >
          KEMBALI
        </button>
        <button 
            onClick={() => {
                handleSave()
                onNext()
            }} 
            className="px-8 py-3 bg-custom-third text-white font-black rounded-[1.5rem] shadow-lg active:scale-95 transition"
        >
          Lanjut Pembayaran
        </button>
      </div>
    </div>
    )
}

//  <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-4 space-y-4 max-h-[50vh] overflow-y-auto">
//         <div className="flex items-center gap-2">
//           <Truck size={18} className="text-custom-second" />
//           <div>
//             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail tiap produk</p>
//             <p className="font-black text-slate-800 text-sm">Shipping, voucher, dan pesan per toko</p>
//           </div>
//         </div>

//         {totalsByShop.map((shop) => (
//           <div key={shop.seller_name} className="bg-white border border-slate-200 rounded-[1.5rem] p-3 space-y-3">
//             <div className="flex items-start justify-between gap-3">
//               <div className="min-w-0">
//                 <p className="text-[12px] font-black text-slate-800 truncate">{shop.seller_name}</p>
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
//                   Subtotal: {PriceFormater(shop.shopSubtotal)}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total toko</p>
//                 <p className="font-black text-custom-alter">{PriceFormater(shop.total)}</p>
//               </div>
//             </div>

//             {/* List Items menggunakan 'products_name' & 'amount' */}
//             <div className="space-y-2 pt-1 border-t border-slate-100">
//               {shop.items.map((it) => (
//                 <div key={it.id} className="flex items-center justify-between gap-3">
//                   <div className="min-w-0">
//                     <p className="text-[11px] font-black text-slate-800 truncate">{it.products_name}</p>
//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
//                       Jumlah: {it.amount}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Harga</p>
//                     <p className="font-black text-slate-800">{PriceFormater(it.price * it.amount)}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Shipping Selection */}
//             <div className="space-y-2">
//               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metode pengiriman</p>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
//                 {SHIPPING_OPTIONS.map((o) => (
//                   <button
//                     key={o.key}
//                     type="button"
//                     onClick={() => setShippingByShop((prev) => ({ ...prev, [shop.seller_name]: o.key }))}
//                     className={`px-3 py-3 rounded-2xl border text-xs font-black transition-all text-left ${
//                       (shippingByShop[shop.seller_name] ?? defaultShippingKey) === o.key
//                         ? "bg-custom-first border-custom-third/20 text-custom-third shadow-sm"
//                         : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between gap-2">
//                       <span>{o.label}</span>
//                       <span className="text-[10px] font-black text-custom-alter">{PriceFormater(o.cost)}</span>
//                     </div>
//                     <div className="mt-1 text-[10px] font-black text-slate-400">{o.eta}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Voucher & Note */}
//             <div className="space-y-3 pt-2">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div className="space-y-1">
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pilih Voucher</p>
//                   <select
//                     value={voucherByShop[shop.seller_name] ?? defaultVoucherKey}
//                     onChange={(e) => setVoucherByShop((prev) => ({ ...prev, [shop.seller_name]: e.target.value }))}
//                     className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-black text-slate-800 outline-none"
//                   >
//                     {VOUCHERS.map((v) => (
//                       <option key={v.key} value={v.key}>{v.label}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="space-y-1">
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catatan Penjual</p>
//                   <input
//                     value={messageByShop[shop.seller_name] ?? ""}
//                     onChange={(e) => setMessageByShop((prev) => ({ ...prev, [shop.seller_name]: e.target.value }))}
//                     placeholder="Tulis pesan..."
//                     className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-black text-slate-800 outline-none"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="flex items-center justify-between gap-3 pt-2">
//         <button
//           type="button"
//           onClick={onBack}
//           className="px-6 py-3 rounded-2xl bg-white text-slate-500 font-black border border-slate-200 hover:bg-slate-50 transition"
//         >
//           Kembali
//         </button>

//         <button
//           type="button"
//           onClick={onNext}
//           className="px-6 py-3 rounded-2xl bg-custom-third text-white font-black hover:opacity-90 transition active:scale-95 shadow-lg shadow-custom-third/20"
//         >
//           Lanjut Metode
//         </button>
//       </div>
