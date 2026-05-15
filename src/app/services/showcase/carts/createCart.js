import { createClient } from "@/app/lib/supabase";

const CreateCart = async (amount, userId, productId) => {
    const supabase = createClient()

    const {data, error} =  await supabase 
    .from('carts')
    .upsert({
        profiles_id: userId,
        products_id: productId,
        amount: amount,
    }, {
        onConflict: 'products_id, profiles_id'
    })
    .select()
    .single()

    if (error) return {success: false, message: error.message}

    return {success: true, message: 'Cart created successfully', data}
}

export default CreateCart