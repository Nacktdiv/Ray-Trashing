import { createClient } from '@/app/lib/supabase'
import { id } from 'zod/v4/locales'

const GetLeaderboard = async (idRt, dbMode) => {
    const supabase = createClient()

    const {data: dataRt, error: errorRt} = await supabase
    .from('rt_rw')
    .select('region_id')
    .eq('id', idRt)
    .single()

    if (errorRt) return {success:false, message:errorRt.message}

    const {data, error} = await supabase
    .from('region')
    .select(`*,
            rt_rw(
                *,
                profiles(count)
                )`
            )
    .eq('id', dataRt?.region_id)
    .order('total_accumulated_points', {foreignTable: 'rt_rw', ascending: false})

    if (error) return {success: false, message: error.message}

    const formattedMap = data[0].rt_rw.map((item, index) => ({
        id: item.id,
        rank: index + 1,
        name: `${item.rt_number} / ${item.rw_number}`,
        points: item.total_accumulated_points, 
        members: item.profiles[0].count
    }))

    const formattedData = {
        region: data[0].nama,
        leaderboard: formattedMap
    }

    if (dbMode) {
        const userRt = formattedData.leaderboard.find((item, i) =>   
            item.id == idRt
        )
        const upperRt = formattedData.leaderboard.find((item, i) => 
            item.rank == userRt.rank - 1
        )
        const dashboardData = {
            userRt: userRt,
            upperRt: upperRt,
            gapPoints : upperRt?.points - userRt?.points || 0,
            percentage : userRt?.points / upperRt?.points  * 100 || 100
        }
        
        return ({success: true, data: dashboardData});
    }

    return ({success: true, data: formattedData});
}

export default GetLeaderboard