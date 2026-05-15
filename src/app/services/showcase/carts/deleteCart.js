import { createClient } from "@/app/lib/supabase";

const DeleteCart = async (cartId) => {
    const supabase = createClient()

    const {data, error} =  await supabase 
    .from('carts')
    .delete()
    .eq('id', cartId)

    if (error) return {success: false, message: error.message}

    return {success: true, message: 'Cart Deleted successfully', data}
}

export default DeleteCart