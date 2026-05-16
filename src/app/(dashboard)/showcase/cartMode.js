"use client";
import { useMemo, useReducer, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ShoppingBag, Loader2 } from "lucide-react"; // Tambah Loader
import { PriceFormater } from "@/app/components/shared/numberFormater";
import CartLine from "@/app/components/cartLine";
import CheckoutModal from "@/app/components/checkoutModal";
import GetCart from "@/app/services/showcase/carts/getCart";
import UpdateCart from "@/app/services/showcase/carts/updateCart";
import DeleteCart from "@/app/services/showcase/carts/deleteCart";
import { useUser } from "@/context/UserContext";

const CartBadge = ({ count }) => (
  <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-custom-second text-white text-[10px] font-black border-2 border-custom-third/20">
    {count}
  </span>
);

export default function CartMode() {
  const { profile } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  const [cart, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_CART": 
          return action.payload.map(item => ({ ...item, id: String(item.id) }));
        case "INC":
          return state.map((it) =>
            it.id === action.id ? { ...it, amount: it.amount + 1 } : it
          );
        case "DEC":
          return state
            .map((it) =>
              it.id === action.id ? { ...it, amount: Math.max(1, it.amount - 1) } : it
            )
            .filter((it) => it.amount > 0);
        case "REMOVE":
          return state.filter((it) => it.id !== action.id);
        default:
          return state;
      }
    },
    [] 
  );

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Fetch data dari database
  useEffect(() => {
    const getCartData = async () => {
      if (!profile?.id) return;
      
      setIsLoading(true);
      const res = await GetCart(profile.id);
      
      if (res.success) {
        dispatch({ type: "SET_CART", payload: res.data });
      } else {
        toast.error(res.message);
      }
      setIsLoading(false);
    };

    getCartData();
  }, [profile?.id]); 

  const cartSelected = useMemo(
    () => cart.filter((it) => selectedIds.has(it.id)),
    [cart, selectedIds]
  );

  const itemsCountSelected = useMemo(
    () => cartSelected.reduce((sum, it) => sum + it.amount, 0),
    [cartSelected]
  );

  const totalHarga = useMemo(
    () => cartSelected.reduce((acc, it) => acc + (it.price * it.amount), 0),
    [cartSelected]
  );

  const handleCheckoutClick = () => {
    if (cart.length === 0) return toast.error("Cart masih kosong");
    if (cartSelected.length === 0) return toast.error("Pilih produk dulu");
    setCheckoutOpen(true);
  };

  const toggleSelected = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUpdateAmount = async (cartId, newAmount, type) => {
    if(newAmount > 0) {
      const res = await UpdateCart(cartId, newAmount)
      if (res.success) {
        dispatch({ type : type, id: cartId });
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    } else {
      const res = await DeleteCart(cartId)
      if (res.success) {
        dispatch({ type : 'REMOVE', id: cartId });
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    }
  }

  const handleDeleteAfterCreateOrder = async () => {
    for (let i = 0; i < cart.length; i++ ) {
      const res = await DeleteCart(cart[i].id)
      if (res.success) {
        dispatch({ type : "REMOVE", id: cart[i].id });
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-custom-third" size={40} />
        <p className="text-slate-500 font-medium italic">Memuat keranjang kamu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <ShoppingBag className="text-custom-second" size={20} />
          Keranjang Belanja
          <CartBadge count={itemsCountSelected} />
        </h2>
      </div>

      <div className="space-y-4">
        {cart.length === 0 ? (
          <div className="py-16 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
            <p className="text-slate-500">Cart kosong.</p>
          </div>
        ) : (
          cart.map((item) => (
            <CartLine
              key={item.id}
              item={item}
              onMinus={(id) => handleUpdateAmount(id, item.amount - 1, "DEC")}
              onPlus={(id) => handleUpdateAmount(id, item.amount + 1, "INC")}
              onRemove={(id) => handleUpdateAmount(id, 0, "REMOVE")}
              isSelected={selectedIds.has(item.id)}
              onToggleSelected={toggleSelected}
            />
          ))
        )}

        {cart.length > 0 && (
          <div className="pt-6 flex flex-col items-end gap-3">
            <div className="text-right">
              <p className="text-sm text-slate-500 font-medium">Total Estimasi:</p>
              <p className="text-2xl font-black text-slate-800">
                {PriceFormater(totalHarga)}
              </p>
            </div>
            <button
              onClick={handleCheckoutClick}
              className="w-full md:w-auto px-10 py-4 rounded-2xl bg-custom-third text-white font-black hover:opacity-90 transition active:scale-95 disabled:bg-slate-300"
              disabled={cartSelected.length === 0}
            >
              Checkout Sekarang
            </button>
          </div>
        )}
      </div>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartSelected={cartSelected}
        onMakeOrder={() => {
          handleDeleteAfterCreateOrder()
          setCheckoutOpen(false);
          toast.success("Pesanan diproses!");
          setSelectedIds(new Set());
        }}
      />
    </div>
  );
}