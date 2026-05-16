"use client";

import { useMemo, useState } from "react";
import { Package, Truck, CreditCard, MapPin, Clock3, Mail, Copy } from "lucide-react";
import toast from "react-hot-toast";
import { PriceFormater } from "@/app/components/shared/numberFormater";
import { UpdateTransactions } from "../services/showcase/transactions/updateTransaction";

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

export default function TransactionModal({
  isOpen,
  onClose,
  transaction,
}) {

  const selectedItemsTotal = useMemo(() => {
    if (!transaction) return 0;
    return (transaction.orders_items ?? []).reduce((acc, it) => {
      const v = it.gross_total ?? it.price_at_purchase ?? 0;
      return acc + v;
    }, 0);
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const status = transaction?.transactions?.status;
  const ui = getStatusUI(status);
  const isPaid = status === "settlement";
  const snapToken = String(transaction?.transactions?.snap_token ?? "");

 const handlePayment = async () => {
  if (!snapToken) {
    toast.error("Snap Token tidak ditemukan");
    return;
  }

  window.snap.pay(snapToken, {
      onSuccess: async function (result) { 
        toast.success('Payment Success');
        
        try {
          const res = await UpdateTransactions(transaction?.transactions?.id);
          if(res.success) {
            window.location.href = "/showcase";
            toast.success('Update Transactions Success');
          } else {
            throw new Error(res.error || "FAILURE");
          }
        } catch (error) {
          toast.error("Failure update transactions:", error);
        }
      },
      onPending: function (result) {
        toast('Wait Im verification your payment');
        window.location.href = "/showcase";
      },
      onError: function (result) {
        toast.error('Payment Error: ' + (result.status_message || 'Terjadi kesalahan'));
      },
      onClose: function () {
        toast('You can return later');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[70] max-w-[100dvw]">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        role="button"
        tabIndex={0}
        aria-label="Tutup modal"
      />
      <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl bg-white rounded-[2rem] border-2 border-custom-third/20 shadow-xl overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-custom-first flex items-center justify-center border border-custom-third/20">
                <Package className="text-custom-third" size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Transaction
                </p>
                <h3 className="font-black text-slate-800 truncate">
                  Transaksi #{transaction.transactions?.id ?? transaction.id}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition active:scale-95"
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {formatCreatedAt(transaction.created_at)} • {transaction.sender_name}
                </p>
                <h3 className="font-black text-slate-800 text-lg truncate">
                  Ringkasan Pesanan
                </h3>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Subtotal
                </p>
                <p className="font-black text-custom-third text-2xl">
                  {PriceFormater(selectedItemsTotal)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-[1.5rem] p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Truck className="text-custom-second" size={16} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Metode Pengiriman
                  </p>
                </div>
                <p className="text-xs font-black text-slate-800">
                  {transaction.shipping_method}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1.5rem] p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-custom-second" size={16} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Metode Pembayaran
                  </p>
                </div>
                <p className="text-xs font-black text-slate-800">
                  {transaction.payment_method}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1.5rem] p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="text-custom-second" size={16} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Alamat Tujuan
                  </p>
                </div>
                <p className="text-xs font-black text-slate-800">
                  {transaction.destination_address}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1.5rem] p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock3 className="text-custom-second" size={16} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black border ${ui.className}`}
                >
                  {ui.icon} {ui.label}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[1.5rem] p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Item Pesanan
                  </p>
                  <p className="text-xs font-black text-slate-800">
                    {transaction.orders_items?.length ?? 0} jenis produk
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {(transaction.orders_items ?? []).map((it) => (
                  <div
                    key={it.id}
                    className="flex items-start justify-between gap-3 border border-slate-100 rounded-2xl px-4 py-3 bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-800 truncate">
                        {it.products_name}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        Qty: {it.amount}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Total
                      </p>
                      <p className="text-sm font-black text-slate-800">
                        {PriceFormater(it.gross_total ?? it.price_at_purchase)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {transaction.message ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-[1.5rem] px-4 py-3">
                <div className="flex items-start gap-3">
                  <Mail className="text-emerald-700 mt-0.5" size={16} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">
                      Catatan
                    </p>
                    <p className="text-xs font-black text-emerald-900/90">
                      {transaction.message}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                className="px-6 py-3 rounded-2xl bg-white text-slate-500 font-black border border-slate-200 hover:bg-slate-50 transition"
                onClick={onClose}
              >
                Tutup
              </button>

              {isPaid ? (
                <button
                  type="button"
                  className="px-6 py-3 rounded-2xl bg-custom-third text-white font-black hover:opacity-90 transition active:scale-95 disabled"
                >
                  Sudah Dibayar
                </button>
              ) : (
                <button
                  type="button"
                  className="px-6 py-3 rounded-2xl bg-custom-third text-white font-black hover:opacity-90 transition active:scale-95"
                  onClick={() => handlePayment()}
                >
                  Bayar / Pay
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
