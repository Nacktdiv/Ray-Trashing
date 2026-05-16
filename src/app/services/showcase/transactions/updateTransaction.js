import { createClient } from "@/app/lib/supabase";

export const UpdateTransactions = async (transactionId) => {
  const supabase = createClient();

  try {

    const { data, error } = await supabase
      .from("transactions")
      .update({status: "settlement"})
      .eq("id", transactionId)
      .select()

    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error("Error updating transactions:", error.message);
    return { success: false, error: error.message, data: [] };
  }
};