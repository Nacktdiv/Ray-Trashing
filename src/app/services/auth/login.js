import { createClient } from '@/app/lib/supabase'

const Login = async (formData) => {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get('email'),
    password: formData.get('password'),
    });

    if (error) return ({success: false, message: error.message});

    return ({success: true, message: 'User logged in successfully'});
}

export default Login;