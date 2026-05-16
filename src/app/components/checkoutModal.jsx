import { CreditCard, Truck, ShoppingBag } from "lucide-react";
import { useEffect, useState} from "react";
import ProdukStep from "./checkoutSteps/ProdukStep";
import AlamatStep from "./checkoutSteps/AlamatStep";
import MetodeStep from "./checkoutSteps/MetodeStep";
import PembayaranStep from "./checkoutSteps/PembayaranStep";
import { useUser } from "@/context/UserContext";
import CreateOrder from "../services/showcase/orders/createOrder";
import toast from "react-hot-toast";

function groupedByShop (cartSelected, profileId) {
  const map = new Map();
  for (const it of cartSelected) {
      const sellerName = it.seller_name || "Toko";
      const existing = map.get(sellerName);
      if (existing) existing.push(it);
      else map.set(sellerName, [it]);
  }

  return Array.from(map.entries()).map(([seller_name, items]) => ({
      profiles_id : profileId,
      sender_id : items[0].seller_id, 
      sender_name : seller_name,
      sender_phone : items[0].seller_phone,   
      subtotal: items.reduce((acc, it) => acc + it.price * it.amount, 0),
      items,
  }));
}

export default function CheckoutModal({ isOpen, onClose, cartSelected, onMakeOrder }) {
  const { profile } = useUser()
  const [step, setStep] = useState("alamat");

  const [orderData, setOrderData] = useState([]);

  // Isi data setiap kali modal DIBUKA
  useEffect(() => {
    if (isOpen && cartSelected) {
      setOrderData(groupedByShop(cartSelected, profile.id));
    }
  }, [isOpen, cartSelected]);

  // const total = useMemo(() => { // detail akhir
  //   return totalsByShop.reduce((acc, t) => acc + (t?.total ?? 0), 0);
  // }, [totalsByShop]);

  // const totalShipping = useMemo(() => { // detail akhir
  //   return totalsByShop.reduce((acc, t) => acc + (t?.shipping ?? 0), 0);
  // }, [totalsByShop]);

  // const totalVoucherDiscount = useMemo(() => { // detail akhir
  //   return totalsByShop.reduce((acc, t) => acc + (t?.voucherDiscount ?? 0), 0);
  // }, [totalsByShop]);

//   useEffect(() => {
//     if (!isOpen || !cartSelected) return;

//     const map = new Map();
//     cartSelected.forEach(it => {
//       const name = it.seller_name || "Toko";
//       if (map.has(name)) map.get(name).push(it);
//       else map.set(name, [it]);
//     });

//     const newGrouped = Array.from(map.entries()).map(([seller_name, items]) => {
//       return {
//         sender_name: seller_name,
//         sender_phone: items[0]?.seller_phone || "-",
//         subtotal: items.reduce((acc, it) => acc + it.price * it.amount, 0),
//         items,
//       };
//     });

//     setOrderData(newGrouped);
// }, [cartSelected, isOpen]);

  useEffect(() => {
    console.log('Perubahan Order Data Realtime: ', orderData)
  }, [orderData])

  const resetOnClose = () => {
    setStep("alamat");
    setOrderData([]);
    // setTotalsByShop([]);
    onClose();
  };

  const handleCreateOrder = async () => {
    const res = await CreateOrder(orderData);
    
    if (res.success) {
        toast.success("Pesanan berhasil dibuat untuk semua toko!");
        console.log('data hasil ', res.data)
        onMakeOrder();
    } else {
        toast.error("Gagal membuat pesanan: " + res.message);
    }
  }

  console.log("data card selected", cartSelected)

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-[60] max-w-[100dvw]">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={resetOnClose}
        role="button"
        tabIndex={0}
        aria-label="Tutup popup checkout"
      />
      <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-3xl bg-white rounded-[2rem] border-2 border-custom-third/20 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-custom-first flex items-center justify-center border border-custom-third/20">
                <CreditCard className="text-custom-third" size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Checkout</p>
                <h3 className="font-black text-slate-800 truncate">Buat pesanan kamu</h3>
              </div>
            </div>

            <button
              type="button"
              onClick={resetOnClose}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition active:scale-95"
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>

          {/* Stepper
          <div className="px-5 pt-5 pb-3">
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "alamat", label: "Alamat" },
                { key: "rincianProduk", label: "Produk" },
                { key: "metode", label: "Metode" },
                { key: "pembayaran", label: "Rincian" },
              ].map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setStep(s.key)}
                  className={`px-4 py-2 rounded-2xl text-xs font-black border transition-all ${
                    step === s.key
                      ? "bg-custom-first border-custom-third/20 text-custom-third shadow-sm"
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div> */}

          <div className="p-5 space-y-5">
            {step === "alamat" && (
              <AlamatStep 
                onNext={() => setStep("rincianProduk")}  
                orderData={orderData}
                setOrderData={setOrderData}
                />
            )}

            {step === "rincianProduk" && (
              <ProdukStep
                onBack={() => setStep("alamat")}
                onNext={() => setStep("metode")}
                orderData={orderData}
                setOrderData={setOrderData}
              />
            )}

            {step === "metode" && (
              <MetodeStep
                onBack={() => setStep("rincianProduk")}
                onNext={() => setStep("pembayaran")}
                orderData={orderData}
                setOrderData={setOrderData}
              />
            )}

            {step === "pembayaran" && (
              <PembayaranStep
                onNext={() => handleCreateOrder()}
                onBack={() => setStep('metode')}
                orderData={orderData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
