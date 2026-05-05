import { createClient } from "@/app/lib/supabase";

const UpdateProfiles = async (formData) => {
    const supabase = createClient()

    if(!formData?.name || !formData?.phone_number || !formData?.kelurahan_kecamatan_selected?.id ){
        return ({success:false, message:"Silahkan lengkapi data nama atau nomor telepon atau kelurahan_kecamatan"})
    }

    const {data, error} = await supabase 
    .from('profiles')
    .update({
        name: formData.name,
        phone_number: formData.phone_number,
        region_id:formData.kelurahan_kecamatan_selected.id,
    })
    .eq('id', formData.id)
    .select()
    .single()

    if(error) return ({success: false, message:error.message})

    if(formData.password){
        const { data, error } = await supabase.auth.updateUser({
            password: formData.password
        });
        
        if (error) return ({success:false, message:error.message})
    }

    return ({success:true, data, message:"Berhasil mengupdate profiles"})
}

export default UpdateProfiles