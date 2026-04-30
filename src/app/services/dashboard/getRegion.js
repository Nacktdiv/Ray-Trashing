import { createClient } from "@/app/lib/supabase"


const GetRegion = async (idRt) => {
    const supabase = createClient()

    const {data, error} = await supabase
    .from('rt_rw')
    .select(`
        id,
        rt_number,
        rw_number,
        kelurahan:region_id(
            id,
            nama,
            kecamatan:parent_id(
                id,
                nama,
                kota:parent_id(
                    id,
                    nama
                )
            )
        )`)
    .eq('id', idRt)
    .single()

    if(error) return ({success: false, message: error.message})

    const dataMap = {
        rt_rw_selected: {id: data?.id, name: `${data?.rt_number}/${data?.rw_number}`},
        rt_rw_data:[
            {id: data?.id, name:`${data?.rt_number}/${data?.rw_number}` }
        ],
        kelurahan_kecamatan_selected:{id: data?.kelurahan?.id, name:`${data?.kelurahan?.nama}-${data?.kelurahan?.kecamatan?.nama}`},
        kota_kab_selected: {id:  data?.kelurahan?.kecamatan?.kota?.id, name:data?.kelurahan?.kecamatan?.kota?.nama }
    }

    return ({success:true, data:dataMap})
}

export default GetRegion