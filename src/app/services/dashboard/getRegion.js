import { createClient } from "@/app/lib/supabase"


const GetRegion = async (idRegion) => {
    const supabase = createClient()

    const {data, error} = await supabase
    .from('region')
    .select(`
        id,
        nama,
        kecamatan:parent_id(
            id,
            nama,
            kota:parent_id(
                id,
                nama
            )
        )`)
    .eq('id', idRegion)
    .single()
    console.log(data)

    if(error) return ({success: false, message: error.message})

    const dataMap = {
        // rt_rw_selected: {id: data?.id, name: `${data?.rt_number}/${data?.rw_number}`},
        // rt_rw_data:[
        //     {id: data?.id, name:`${data?.rt_number}/${data?.rw_number}` }
        // ],
        kelurahan_kecamatan_selected:{id: data?.id, name:`${data?.nama}-${data?.kecamatan?.nama}`},
        kota_kab_selected: {id:  data?.kecamatan?.kota?.id, name:data?.kecamatan?.kota?.nama }
    }

    return ({success:true, data:dataMap})
}

export default GetRegion