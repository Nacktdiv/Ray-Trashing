import { createClient } from "@/app/lib/supabase";
import { id } from "zod/v4/locales";

const GetProducts = async (timestamp = null) => {
    const supabase = createClient()

    let query = supabase 
    .from('get_product_detail')
    .select('*')
    .eq('ai_validation_status', 'Published')
    .order('created_at', {ascending : false})
    .limit(10)

    query = timestamp ? query.lt('created_at', last_item_timestamp) : query

    const {data, error} = await query

    if (error) return {success: false, message: error.message}

    return { success: true, data: data }

}

export default GetProducts