'use server'
import { google } from '@ai-sdk/google';
import { generateObject, generateText } from 'ai';
const { z, success } = require("zod")
import { createClient } from '@/app/lib/supabaseServer';

const ValidationProject = async (image, type, data) => {
    const supabase = await createClient()

    const {text} = await generateText ({
        model: google('gemma-3-27b-it'),
        messages: [
        {
            role: 'user',
            content: [
                { 
                    type: 'text', 
                    text: `Tugas: Validasi apakah gambar yang dilampirkan adalah hasil akhir dari proyek berjudul: "${data?.title}".

                            ATURAN OUTPUT:
                            1. Kamu ADALAH mesin validator.
                            2. Jawab HANYA dalam format JSON murni.
                            3. DILARANG memberikan teks penjelasan, pembukaan, atau penutup.
                            4. DILARANG menggunakan markdown code blocks (\`\`\`json).

                            STRUKTUR JSON:
                            {
                            "is_valid": boolean (true jika gambar sesuai dengan judul proyek, false jika tidak),
                            "accuracy_level": "low" | "medium" | "high" (tingkat kemiripan visual),
                            "message": "penjelasan singkat maksimal 15 kata"
                            }`
                },
                { type: 'image', image: image },
            ]
        }
    ]
    })

    const datadummy = {
        is_valid: true,
        accuracy_level: 'medium',
        message:'berhasil yeyyy'
    }

    const status = "Complete"

    if (!text) return ({success:false, message:"Respon text dari gemma tidak sesuai atau error"})
    
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const validationResult = await JSON.parse(cleanJson)
    
    if (validationResult?.is_valid) {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const fileType = type.split("/")[1]
        const fileName = `validation_${data.id}_${Date.now()}.${fileType}`;

        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('projects')
            .upload(fileName, buffer, {
                contentType: fileType,
                upsert: true
            });

        if (uploadError) return { success : false, message: uploadError.message }
        
        const { data: { publicUrl } } = supabase
            .storage
            .from('projects')
            .getPublicUrl(fileName);

        const { error: updateError } = await supabase
            .from('projects')
            .update({ 
                ai_validation_status: status,
                final_image_url: publicUrl
            })
            .eq('id', data.id);

        if (updateError) return { success: false, message: updateError.message };

        return { success: true, message: validationResult?.message || 'Validation successful' }
    }

    return { success: false, message: 'Validation failed' }
}

export default ValidationProject