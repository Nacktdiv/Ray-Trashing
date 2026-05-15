import { createClient } from "@/app/lib/supabase";

const GetCart = async (userId) => {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('carts')
        .select(`
            id,
            amount,
            subtotal,
            products!inner (
                id,
                price,
                whatsapp,
                projects!inner (
                    title,
                    material_category,
                    final_image_url
                ),
                profiles!inner (
                    id,
                    name, 
                    phone_number
                )
            )
        `)
        .eq('profiles_id', userId)

    if (error) return { success: false, message: error.message }

    // Proses Formating Data
    const formattedData = data.map((item) => {
        return {
            id: item.id,
            products_id : item.products.id,
            products_name: item.products.projects.title,
            price: item.products.price,
            imageUrl: item.products.projects.final_image_url,
            material_category: item.products.projects.material_category,
            seller_id : item.products.profiles.id,
            seller_name: item.products.profiles.name,
            seller_phone: item.products.profiles.phone_number,
            amount: item.amount,
            subtotal: item.subtotal,
        }
    })

    return { success: true, message: 'Cart get successfully', data: formattedData }
}

export default GetCart