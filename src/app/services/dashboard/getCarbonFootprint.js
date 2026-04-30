import { createClient } from "@/app/lib/supabase";
import { success } from "zod";

const GetCarbonFootprint = async (idUser) => {
    const supabase = createClient()

    const {data, error} = await supabase
    .from('projects')
    .select(`
        id, 
        carbon_footprint,
        ai_validation_status,
        project_members!inner(
            id,
            role,
            profiles!inner(
                id
            )
        )
    `)
    .eq('project_members.profiles.id', idUser)
    .neq('ai_validation_status', "Pending")

    if (error) return ({success: false, message:error.message})

    const totalCarbonFootprint = data.reduce((acc, curr)  => {
        return acc + curr.carbon_footprint
    }, 0.0)

    return ({success:true, data:totalCarbonFootprint});
}

export default GetCarbonFootprint