import { createClient } from "@/app/lib/supabase"

const GetProject = async (user_id) => {
    const supabase = createClient()

    const { data: rawData, error } = await supabase
    .from('project_members')
    .select(`
      projects (
        *,
        project_members (
          id,
          is_completed,
          role,
          task_description,
          profiles (
            name,
            id
          )
        )
      )
    `)
    .eq('user_id', user_id)

    if (error) return ({success: false, message: error.message});

    const projectsData = rawData.reduce((acc, item) => {
        const proj = item.projects
        if (!proj) return acc

        const category = proj.type

        const status = proj.ai_validation_status == "Pending" ? 'ongoing' : 'completed'
        
        if(acc[category]) {
        acc[category][status].push({
            id:proj.id,
            title: proj.title,
            material: proj.material_category,
            difficulty: proj.difficulty,
            join_code: proj.join_code,
            points_earned: proj.points_earned,
            type:proj.type,
            ai_validation_status:proj.ai_validation_status,
            date: new Date(proj.created_at).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
            }),
            member_count: proj.project_members.length,
            member_complete: category === 'Individual' ? 100 : 
            proj.project_members.reduce((acc, item) => {
            if (item.is_completed) acc += 1
            return acc
            },0),
            members: proj.project_members.map(m => ({
            member_id: m.id,
            user_id: m.profiles?.id,
            name: m.profiles?.name,
            role: m.role,
            is_completed: m.is_completed,
            task: m.task_description
            }))
        })
        }

        return acc
    }, {
        Individual: {ongoing: [], completed: []},
        Community: {ongoing: [], completed: []},
    })

    return ({success: true, data: projectsData});
}

export default GetProject;