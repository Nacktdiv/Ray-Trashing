import { createClient } from "@/app/lib/supabase";

const UpdateCart = async (cartId, amountData) => {
    const supabase = createClient()

    const {data, error} =  await supabase 
    .from('carts')
    .update({amount : amountData})
    .eq('id', cartId)

    if (error) return {success: false, message: error.message}

    return {success: true, message: 'Cart updated successfully', data}
}

export default UpdateCart