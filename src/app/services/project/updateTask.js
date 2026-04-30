import { createClient } from "@/app/lib/supabase";

const UpdateTask = async (task) => {
    const supabase = createClient()

    const updatePromises = task.map((item) => {
        return supabase
          .from("project_members")
          .update({ task_description: item.task })
          .eq("id", item.member_id);
      });

      const results = await Promise.all(updatePromises);
      const hasError = results.some(res => res.error);
      
      if (hasError) return ({ success: false, message: 'Failed to update task' });

    return ({ success: true, message: 'Task updated successfully' });
}

export default UpdateTask;