import { createClient } from "@/app/lib/supabase"

const GetChatbot = async (user, id) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('project_members')
    .select(`
        *,
        projects!inner(id)
    `)
    .eq('user_id', user?.id)
    .eq('projects.id', id)

    if (error) return ({ success: false, message: 'error when get chatbot: ' + error.message })

    return ({ success: true, message: 'Chatbot data retrieved successfully', data })
}

export default GetChatbot;