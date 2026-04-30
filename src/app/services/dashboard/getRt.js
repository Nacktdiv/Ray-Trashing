import { createClient } from "@/app/lib/supabase";

const GetRt = async (region_id) => {
    const supabase = createClient()

    const { data, error } = await supabase
    .from('rt_rw')
    .select('id, rt_number, rw_number')
    .eq('region_id', region_id)

    if (error) return ({success: false, message: error.message});

    const formatterData = data.map((item, i) => ({
        id: item.id,
        name: `${item.rt_number}/${item.rw_number}`
    }))

    return ({success: true, data: formatterData});
}

export default GetRt;
