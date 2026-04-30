import { createClient } from '../../lib/supabase'

const Register = async (formData) => {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
    email: formData.get('email'),
    password: formData.get('password'),
    options: {
        data: {
        full_name: formData.get('fullname'),
        rt_id: formData.get('area'),
        phone_number: formData.get('phone')
        }
    }
    });
    if (error) return ({success: false, message: error.message});

    return ({success: true, message: 'User registered successfully'});
}

export default Register;