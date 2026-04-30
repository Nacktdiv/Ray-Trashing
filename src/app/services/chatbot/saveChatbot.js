import { createClient } from "@/app/lib/supabase";

const SaveChatbot = async (currentMessages, id, profile) => {

    const supabase = createClient()

      if (!id || currentMessages.length === 0) return;

      const { data,error } = await supabase
        .from('project_members')
        .update({ chat_history: currentMessages })
        .eq('project_id', id)
        .eq('user_id', profile.id) 

      if (error) return ({ success: false, message: error.message })

      return ({ success: true, message: 'Chat history saved successfully' });
};

export default SaveChatbot;