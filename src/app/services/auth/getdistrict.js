import { createClient } from '@/app/lib/supabase'

const GetDistrict= async (userInput, idCity) => {
    const supabase = createClient()
    const {data, error} = await supabase
    .from('region')
    .select(`
        id,
        nama,
        kecamatan:parent_id!inner(
            id,
            nama,
            parent_id
        )`)
    .eq('kecamatan.parent_id', idCity)
    .eq('level', 4)
    .ilike('nama', `%${userInput}%`)
    .limit(10)

    if (error) return {success:false, message:error.message}

    const formattedData = data.map(item => ({
        id: item.id,
        nama: `${item.nama} (${item.kecamatan.nama})`,
        city_id: item.kecamatan.parent_id
    }))

    return ({success: true, data: formattedData});
}

export default GetDistrict