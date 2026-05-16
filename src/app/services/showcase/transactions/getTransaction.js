import { createClient } from "@/app/lib/supabase";

export const GetTransaction = async (profiles_id) => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        transactions!inner (
          id,
          status,
          payment_type,
          snap_token
        ),
        orders_items!inner (
          id,
          products_id,
          amount,
          price_at_purchase,
          gross_total,
          products!inner (
            projects!inner (
                title
            )
          )
        )
      `)
      .eq("profiles_id", profiles_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formattedData = data.map((order) => ({
      ...order,
      orders_items: order.orders_items.map((item) => ({
        ...item,
        products_name: item.products?.projects?.title || "Produk Tidak Diketahui",
      })),
      transactions: Array.isArray(order.transactions) 
        ? order.transactions[0] 
        : order.transactions,
    }));

    return { success: true, data: formattedData };
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    return { success: false, error: error.message, data: [] };
  }
};