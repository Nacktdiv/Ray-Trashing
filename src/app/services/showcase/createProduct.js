import { createClient } from "@/app/lib/supabase";

const CreateProduct = async (form, userId, projectId) => {
    const supabase = createClient()
    const {data, error} = await supabase
    .from('products')
    .upsert({
        project_id: projectId,
        profiles_id: userId,
        price: form.price,
        description: form.description,
        whatsapp:form.whatsapp
    }, { 
        onConflict: 'project_id' 
    })
    .select()
    .single()

    if (error) return {success: false, message: error.message}

    return {success: true, message: 'Product created successfully', data}
}

export default CreateProduct