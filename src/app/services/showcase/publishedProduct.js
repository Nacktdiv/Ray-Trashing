import { createClient } from "@/app/lib/supabase";

const PublishedProduct = async (projectId) => {
    const supabase = createClient()

    const {data: statusProduct, error: statusProductError} = await supabase
    .from('products')
    .select('project_id')
    .eq('project_id', projectId)
    .maybeSingle()
    
    if (statusProductError) return {success: false, message: 'Error while checking product status: ' + statusProductError.message}

    if (statusProduct === null) return {success: false, message: 'Product not found, Please Create Procuct first by assigning details to your project'}

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