import { createClient } from '../../lib/supabase'

const Register = async (formData, idRegion) => {
    const supabase = createClient()

    console.log(idRegion)

    const { data, error } = await supabase.auth.signUp({
    email: formData.get('email'),
    password: formData.get('password'),
    options: {
        data: {
        full_name: formData.get('fullname'),
        region_id: idRegion,
        phone_number: formData.get('phone')
        }
    }
    });
    if (error) return ({success: false, message: error.message});

    return ({success: true, message: 'User registered successfully'});
}

export default Register;