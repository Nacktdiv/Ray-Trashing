import { createClient } from "@/app/lib/supabase";

const CreateProject = async (selectedProject, profile, carbonFootprint) => {
    const supabase = createClient()

    let points;

    switch (selectedProject?.difficulty){
    case 'mudah' :
        points = 200
        break
    case 'sedang' :
        points = 400
        break
    case 'sulit' :
        points = 600
        break
    }

    const {data : projectData, error: projectError} = await supabase.from('projects').insert(
    {
        title: selectedProject?.title,
        type: selectedProject?.type,
        difficulty: selectedProject?.difficulty,
        material_category: selectedProject?.material_category,
        points_earned: points,
        carbon_footprint: carbonFootprint
    }
    )
    .select()
    .single()

    if (projectError) return ({success: false, message: projectError.message})

    const {data: memberData, error: memberError} = await supabase.from('project_members').insert(
    {
        project_id:projectData?.id, 
        user_id:profile?.id,
        role:"Leader"
    }
    )
    .select()
    .single()

    if (memberError) return ({success: false, message: memberError.message})
    
    return ({success: true, message: 'Project created successfully', data: projectData})
};

export default CreateProject;