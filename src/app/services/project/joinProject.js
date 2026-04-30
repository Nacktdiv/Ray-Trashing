import { createClient } from "@/app/lib/supabase";

const JoinProject = async (isCode, profile) => {
    const supabase = createClient()
    
    const {data:projectData , error:projectErrorData} = await supabase
    .from('projects')
    .select('id')
    .eq('join_code', isCode)
    .single()

    
    if (projectErrorData) return ({success: false, message: projectErrorData.message})

    const {data:memberData, error:memberErrorData } = await supabase
    .from('project_members')
    .insert({
        project_id:projectData.id,
        role:'Member',
        user_id:profile.id
    })

    if (memberErrorData) return ({success: false, message: memberErrorData.message})

    return ({success: true, message: "Berhasil bergabung dengan proyek"})
}

export default JoinProject