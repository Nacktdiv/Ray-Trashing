import toast from "react-hot-toast";
import { useState, useEffect } from "react";

export default function MetodeStep({ onBack, onNext, orderData, setOrderData }) {
    const options = [
        { key: "bank_transfer", label: "Bank_Transfer" },
        { key: "other_qris", label: "QRIS" },
        { key: "gopay", label: "Gopay" },
        { key: "indomaret", label: "Indomaret" },
    ];

    const [paymentMethod, setPaymentMethod] = useState("bank_transfer");

    useEffect(() => {
        if (!orderData) return 

        setPaymentMethod(orderData.payment_method || 'bank_transfer')
    }, [orderData])

    const handleSave = () => {
        setOrderData((prev) => {
            return prev.map((item, index) => ({
                ...item,
                payment_method : paymentMethod,
            }))   
        })
    }

    return (
        <div className="space-y-4">
        <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-4 space-y-4">
            <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-custom-first flex items-center justify-center border border-custom-third/20">
                <span className="text-custom-third font-black text-base">💳</span>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metode pembayaran</p>
                <p className="font-black text-slate-800 text-sm">Pilih salah satu</p>
            </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((m) => (
                <button
                key={m.key}
                type="button"
                onClick={() =>setPaymentMethod(m.key)}
                className={`px-4 py-3 rounded-2xl border text-xs font-black transition-all ${
                    paymentMethod === m.key
                    ? "bg-custom-first border-custom-third/20 text-custom-third shadow-sm"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
                >
                {m.label}
                </button>
            ))}
            </div>

            <div className="text-[11px] font-black text-slate-500">
            Dipilih: <span className="text-custom-alter">{paymentMethod}</span> (demo)
            </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <button
            type="button"
            onClick={() => {
                handleSave()
                onBack();
            }}
            className="px-5 py-3 rounded-[1.5rem] bg-white text-custom-third font-black border border-custom-third/20 hover:bg-custom-first/30 transition"
            >
            Kembali
            </button>

            <button
            type="button"
            onClick={() => {
                handleSave()
                onNext();
            }}
            className="px-5 py-3 rounded-[1.5rem] bg-custom-third text-white font-black border-2 border-custom-third/30 shadow-sm hover:scale-[1.01] transition active:scale-[0.99]"
            >
            Lihat Rincian Pembayaran
            </button>
        </div>
        </div>
    );
}
