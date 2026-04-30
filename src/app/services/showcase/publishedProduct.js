import { createClient } from "@/app/lib/supabase";

const PublishedProduct = async ( projectId) => {
    const supabase = createClient()

    const {data, error} = await supabase
    .from('projects')
    .update({ai_validation_status: 'Published'})
    .eq('id', projectId)
    .select()
    .single()

    if (error) return {success: false, message: error.message}

    return {success: true, message: 'Product published successfully', data}
}

export default PublishedProduct