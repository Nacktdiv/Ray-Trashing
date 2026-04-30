import { createClient } from "@/app/lib/supabase";

const UnpublishedProject = async ( projectId) => {
    const supabase = createClient()

    const {data, error} = await supabase
    .from('projects')
    .update({ai_validation_status: 'Complete'})
    .eq('id', projectId)
    .select()
    .single()

    if (error) return {success: false, message: error.message}

    return {success: true, message: 'Project unpublished successfully', data}
}

export default UnpublishedProject