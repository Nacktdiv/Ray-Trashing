import { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function AlamatStep({ onNext, orderData, setOrderData }) {
    const [receiverName, setReceiverName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        setReceiverName(orderData?.[0]?.receiver_name || '')
        setPhone(orderData?.[0]?.receiver_phone || '')
        setAddress(orderData?.[0]?.destination_address || '')
    }, [orderData])

    const handleSave = () => {
        setOrderData((prev) => {
            if (!Array.isArray(prev)) return [];

            return prev.map((item, index) => ({
                ...item, 
                receiver_name: receiverName,
                receiver_phone: phone,
                destination_address: address
            }))
        })
    }

    const phoneSanitized = useMemo(() => phone.replace(/[^\d]/g, "").slice(0, 15), [phone]);

    return (
        <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Penerima</p>
            <input
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="Contoh: Siti"
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-custom-second/20"
            />
            </div>

            <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No. HP</p>
            <input
                inputMode="tel"
                value={phoneSanitized}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-custom-second/20"
            />
            </div>
        </div>

        <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alamat Lengkap</p>
            <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Jalan..., RT/RW..., Kelurahan..., Kecamatan..., Kota..."
            className="min-h-[110px] w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-custom-second/20 resize-none"
            />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
            type="button"
            onClick={() => {
                if (!receiverName.trim()) return toast.error("Nama penerima wajib diisi");
                if (!phoneSanitized.trim()) return toast.error("No. HP wajib diisi");
                if (!address.trim()) return toast.error("Alamat wajib diisi");
                handleSave()
                onNext();
            }}
            className="px-5 py-3 rounded-[1.5rem] bg-custom-third text-white font-black border-2 border-custom-third/30 shadow-sm hover:scale-[1.01] transition active:scale-[0.99]"
            >
            Lanjut Produk
            </button>
        </div>
        </div>
    );
}
