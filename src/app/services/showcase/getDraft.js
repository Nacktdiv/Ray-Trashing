import { createClient } from "@/app/lib/supabase";
import { id } from "zod/v4/locales";

const GetDraft = async (idUser) => {
    const supabase = createClient()

    const {data, error} = await supabase 
    .from('projects')
    .select(`id,
            title,
            material_category,
            ai_validation_status,
            final_image_url,
            project_members!inner(
                user_id,
                role
                ),
            products(
                price,
                description, 
                whatsapp
            )`
            )
    .eq('project_members.user_id', idUser)
    .in('ai_validation_status', ['Complete', 'Published'])


    if (error) return {success: false, message: error.message}

    const dataFilter = data.filter(project => {
        return project.project_members[0].role === 'Leader' && project
    })

    const dataMap = dataFilter.map (project => ({
        id: project.id,
        title: project.title,
        material_category: project.material_category,
        ai_validation_status: project.ai_validation_status,
        final_image_url: project.final_image_url,
        user_id: project.project_members[0].user_id,
        price: project?.products?.price || null,
        description: project?.products?.description || null,
        whatsapp:project?.products?.whatsapp || null
    }))

    return { success: true, data: dataMap }

}

export default GetDraft