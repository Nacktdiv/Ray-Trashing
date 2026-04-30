import { createClient } from '@/app/lib/supabase'

const GetCity = async (userInput) => {
    const supabase = createClient()
    const {data, error} = await supabase
    .from('region')
    .select('*')
    .eq('level', 2)
    .ilike('nama', `%${userInput}%`)
    .limit(10)

    if (error) return {success:false, message:error.message}

    const formattedData = data.map((item, i) => ({
        id: item.id,
        name: item.nama
    }))

    return ({success: true,  data:formattedData});
}

export default GetCity
