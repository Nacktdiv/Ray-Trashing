"use client";

import { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, Package, Truck, CreditCard, Mail } from "lucide-react";
import { PriceFormater } from "@/app/components/shared/numberFormater";
import TransactionModal from "@/app/components/transactionModal";
import { GetTransaction } from "@/app/services/showcase/transactions/getTransaction";
import { useUser } from "@/context/UserContext";

// const dataDummy = [
//   {
//     id: 1001,
//     created_at: "2024-05-18T08:00:00Z",
//     profiles_id: "uuid-user-123",
//     sender_name: "Toko Olahraga Jaya",
//     sender_phone: "081122334455",
//     reciever_name: "Andi Wijaya",
//     reciever_phone: "085299887766",
//     destination_address: "Jl. Sudirman No. 1, Jakarta Pusat",
//     shipping_method: "JNE Reguler",
//     payment_method: "Bank Transfer",
//     subtotal: 500000,
//     message: "Tolong dicek kembali ukurannya.",
//     transactions: {
//       id: 5001,
//       status: "settlement",
//       payment_type: "bank_transfer",
//       snap_token: "snap-token-abc-123",
//     },
//     orders_items: [
//       {
//         id: 9001,
//         products_id: "prod-uuid-001",
//         product_name: "Bola Basket Spalding",
//         amount: 1,
//         price_at_purchase: 500000,
//         gross_total: 500000,
//       },
//     ],
//   },
//   {
//     id: 1002,
//     created_at: "2024-05-19T14:20:00Z",
//     profiles_id: "uuid-user-123",
//     sender_name: "Fashion Hub",
//     sender_phone: "089988776655",
//     reciever_name: "Andi Wijaya",
//     reciever_phone: "085299887766",
//     destination_address: "Jl. Sudirman No. 1, Jakarta Pusat",
//     shipping_method: "GoSend Instant",
//     payment_method: "GoPay",
//     subtotal: 275000,
//     message: null,
//     transactions: {
//       id: 5002,
//       status: "pending",
//       payment_type: "gopay",
//       snap_token: "snap-token-def-456",
//     },
//     orders_items: [
//       {
//         id: 9002,
//         products_id: "prod-uuid-002",
//         product_name: "T-Shirt Oversize Black",
//         amount: 2,
//         price_at_purchase: 100000,
//         gross_total: 200000,
//       },
//       {
//         id: 9003,
//         products_id: "prod-uuid-003",
//         product_name: "Topi Baseball",
//         amount: 1,
//         price_at_purchase: 75000,
//         gross_total: 75000,
//       },
//     ],
//   },
//   {
//     id: 1003,
//     created_at: "2024-05-20T09:10:00Z",
//     profiles_id: "uuid-user-123",
//     sender_name: "Elektronik Murah",
//     sender_phone: "087766554433",
//     reciever_name: "Andi Wijaya",
//     reciever_phone: "085299887766",
//     destination_address: "Jl. Sudirman No. 1, Jakarta Pusat",
//     shipping_method: "SiCepat",
//     payment_method: "ShopeePay",
//     subtotal: 120000,
//     message: "Kirim sebelum jam 5 sore.",
//     transactions: {
//       id: 5003,
//       status: "expire",
//       payment_type: "shopeepay",
//       snap_token: "snap-token-ghi-789",
//     },
//     orders_items: [
//       {
//         id: 9004,
//         products_id: "prod-uuid-004",
//         product_name: "Kabel Data Type-C Fast Charging",
//         amount: 3,
//         price_at_purchase: 40000,
//         gross_total: 120000,
//       },
//     ],
//   },
// ];

function formatCreatedAt(iso) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return iso;
  }
}

function getStatusUI(status) {
  switch (status) {
    case "settlement":
      return {
        label: "Settlement",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: "✓",
      };
    case "pending":
      return {
        label: "Pending",
        className: "bg-amber-50 text-amber-700 border-amber-200",
        icon: "⏳",
      };
    case "expire":
      return {
        label: "Expired",
        className: "bg-rose-50 text-rose-700 border-rose-200",
        icon: "⌛",
      };
    default:
      return {
        label: status ?? "Unknown",
        className: "bg-slate-50 text-slate-700 border-slate-200",
        icon: "•",
      };
  }
}

export default function TransactionMode() {
  const { profile } = useUser()

  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const result = await GetTransaction(profile.id);
      if (result.success) {
        setTransactions(result.data);
      } else {
        toast.error("Gagal memuat transaksi");
      }
      setIsLoading(false);
    };

    if (profile.id) fetchOrders();
  }, [profile.id]);

  const filteredTransactions = useMemo(() => {
    if (!filterStatus) return transactions;
    return transactions.filter((t) => t?.transactions?.status === filterStatus);
  }, [transactions, filterStatus]);

  const totalTransaksi = useMemo(() => {
    return filteredTransactions.length;
  }, [filteredTransactions]);

  const statusSummary = useMemo(() => {
    const counts = { settlement: 0, pending: 0, expire: 0 };
    for (const t of transactions) {
      const s = t?.transactions?.status;
      if (counts[s] !== undefined) counts[s] += 1;
    }
    return counts;
  }, [transactions]);

  const handleOpenDetail = async (t) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 350));
    setIsLoading(false);
    setSelected(t);
  };

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-custom-third" size={40} />
        <p className="font-black text-slate-500">Menghubungkan ke Server...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <CreditCard className="text-custom-third" size={20} /> Daftar Transaksi
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            {totalTransaksi} transaksi di sistem. Cek status pembayaran & detail pengiriman.
          </p>
          {filterStatus ? (
            <button
              type="button"
              onClick={() => setFilterStatus(null)}
              className="mt-2 text-xs font-black text-custom-third hover:opacity-80 transition"
            >
              Hapus filter: {filterStatus}
            </button>
          ) : null}
        </div>

        <div className="flex gap-2 flex-wrap">
          {[
            { key: "settlement", label: "Settlement", count: statusSummary.settlement, cls: "text-emerald-700" },
            { key: "pending", label: "Pending", count: statusSummary.pending, cls: "text-amber-700" },
            { key: "expire", label: "Expired", count: statusSummary.expire, cls: "text-rose-700" },
          ].map((s) => (
            <button
              type="button"
              key={s.key}
              onClick={() => setFilterStatus((prev) => (prev === s.key ? null : s.key))}
              className={`px-4 py-2 bg-white border rounded-2xl flex items-center gap-2 transition ${
                filterStatus === s.key ? "border-custom-third/50 shadow-sm" : "border-slate-200 hover:border-slate-300"
              }`}
              aria-label={`Filter transaksi: ${s.label}`}
            >
              <span className={`text-xs font-black ${s.cls}`}>{s.label}</span>
              <span className="text-xs font-black text-slate-800">{s.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTransactions.map((t) => {
          const status = t?.transactions?.status;
          const ui = getStatusUI(status);
          const itemCount = t.orders_items?.reduce((acc, it) => acc + (it.amount ?? 0), 0) ?? 0;

          return (
            <div
              key={t.id}
              className="bg-white rounded-[2rem] border-2 border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => handleOpenDetail(t)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleOpenDetail(t);
              }}
              aria-label={`Lihat detail transaksi ${t.id}`}
            >
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="w-10 h-10 rounded-2xl bg-custom-first border border-custom-third/20 flex items-center justify-center">
                        <Package className="text-custom-third" size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                          #{t.transactions?.id ?? t.id} • {formatCreatedAt(t.created_at)}
                        </p>
                        <h3 className="font-black text-slate-800 text-base truncate">{t.sender_name}</h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilterStatus(status);
                      }}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-black border ${ui.className} hover:opacity-90 transition`}
                      title="Klik untuk filter status"
                      aria-label={`Filter transaksi dengan status ${ui.label}`}
                    >
                      {ui.icon} {ui.label}
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                      <Truck className="text-custom-second" size={16} />
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipping</p>
                        <p className="text-xs font-black text-slate-800 truncate">{t.shipping_method}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                      <CreditCard className="text-custom-second" size={16} />
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment</p>
                        <p className="text-xs font-black text-slate-800 truncate">{t.payment_method}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-3">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Belanja</p>
                    <p className="text-2xl font-black text-custom-third">{PriceFormater(t.subtotal)}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-start md:justify-end">
                    <span className="px-3 py-1.5 rounded-full text-[11px] font-black bg-slate-50 border border-slate-200 text-slate-700">
                      {itemCount} item
                    </span>
                    <span className="px-3 py-1.5 rounded-full text-[11px] font-black bg-slate-50 border border-slate-200 text-slate-700">
                      {t.reciever_name}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="px-8 py-3 bg-custom-third text-white font-black rounded-[1.5rem] shadow-lg active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetail(t);
                    }}
                    disabled={isLoading}
                  >
                    {isLoading && selected?.id === t.id ? (
                      <span className="inline-flex items-center gap-2 justify-center">
                        <Loader2 className="animate-spin" size={16} /> Loading
                      </span>
                    ) : (
                      "Lihat Detail"
                    )}
                  </button>
                </div>
              </div>

              {t.message ? (
                <div className="px-5 pb-5">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-start gap-3">
                    <Mail className="text-emerald-700 mt-0.5" size={16} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Catatan</p>
                      <p className="text-xs font-black text-emerald-900/90 truncate">{t.message}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}

        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
            <p className="text-slate-400 font-medium">Belum ada transaksi untuk status ini.</p>
          </div>
        ) : null}
      </div>

      <TransactionModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        transaction={selected}
      />
    </div>
  );
}
