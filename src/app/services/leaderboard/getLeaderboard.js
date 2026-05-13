import { createClient } from '@/app/lib/supabase'
import { p } from 'framer-motion/client';
import { success } from 'zod'

const GetLeaderboard = async (idRegion, mode) => {
    const supabase = createClient()

   const { data: dataArea, error: errorArea } = await supabase
    .from('region')
    .select(`
        id,
        nama,
        total_accumulated_points,
        level,
        kecamatan: parent_id!inner (
            id,
            nama,
            kotakab: parent_id!inner (
                id,
                nama
            )
        )
    `)
    .eq('id', idRegion) // Jika ini masih gagal, pastikan idRegion tidak undefined
    .single();

    if (errorArea) return {success: false, message: errorArea.message}

    let dataRaw = []

    if(mode === 'kotakab') {
        const {data, error} = await supabase
        .from('region')
        .select(`*,
                kecamatan: parent_id!inner(
                    nama,
                    kotakab: parent_id!inner(
                        nama
                        )
                    )`
                )
        .eq('kecamatan.kotakab.id', dataArea.kecamatan.kotakab.id)
        .order('total_accumulated_points', {ascending: false, nullsFirst: false})
        .limit(10)
        if (error) return {success: false, message: error.message}
        dataRaw = data
    } else if (mode === 'kecamatan') {
        const {data, error} = await supabase
        .from('region')
        .select(`*,
                kecamatan: parent_id!inner(
                    nama,
                    kotakab: parent_id!inner(
                        nama
                        )
                    )`
                )
        .eq('kecamatan.id', dataArea.kecamatan.id)
        .order('total_accumulated_points', {ascending: false, nullsFirst: false})
        .limit(10)
        if (error) return {success: false, message: error.message}
        dataRaw = data
    } else  {
        const {data, error} = await supabase 
        .from('profiles')
        .select(`*,
                kelurahan: region_id!inner(
                    nama,
                    kecamatan: parent_id!inner(
                        nama,
                        kotakab: parent_id!inner(
                            nama
                        )
                    )
                )`
            )
        .order('total_individual_points', {ascending: false, nullsFirst: false})
        .limit(10)
        if (error) return {success: false, message: error.message}

        const formattedData = data.map((item, index) => ({
            id: item.id,
            rank: index + 1,
            name: `${item.name} - ${item.kelurahan.kecamatan.kotakab.nama}`,
            points: item.total_individual_points,
            region_id: item.region_id
        }))

        return ({success: true, data: formattedData});
    }

    const formattedData = dataRaw.map((item, index) => ({
        id: item.id,
        rank: index + 1,
        name: `${item.nama} - ${item.kecamatan.nama} - ${item.kecamatan.kotakab.nama}`,
        points: item.total_accumulated_points, 
        members: item.profiles_count 
    }))

    return ({success: true, data: formattedData});
}

export default GetLeaderboard