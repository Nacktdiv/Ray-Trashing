'use server'
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { success, z } from 'zod'

const MessageSchema = z.object({
    id: z.int(),
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
});

const ParseTextOutput = async (str) => {
    try {
        const firstBracket = str.indexOf('{')
        const lastBracket = str.lastIndexOf('}')

        if (firstBracket == -1 || lastBracket == -1) return null

        const cleanString = str.substring(firstBracket, lastBracket + 1)

        return JSON.parse(cleanString)
    } catch (err) {
        return err.message
    }
}

const GetAnswer = async (messages) => {
        const validatedMessages = z.array(MessageSchema).parse(messages);

        const lastMessage = validatedMessages[validatedMessages.length - 1]

        const formattedMessages = [
            ...validatedMessages.slice(0, -1),
            {
                ...lastMessage,
                content: `${lastMessage.content}\n\n[SISTEM: Jawab WAJIB format JSON murni sesuai skema: {"answer": "...", "summary_so_far": "...", "suggested_action": "..."}.]`
            }
        ]

        const {text} = await generateText({
            model: google('gemma-3-27b-it'),
            system: `Anda adalah "Eco-Assistant", pakar manajemen proyek lingkungan yang cerdas dan empatis.

                    Tugas Utama:
                    1. Memberikan solusi teknis mengenai proyek yang dipilih dan dibahas.
                    2. Selalu merujuk pada pesan-pesan sebelumnya dalam riwayat percakapan (history) untuk menjaga konsistensi konteks.
                    3. Jika user menanyakan perkembangan, gunakan history untuk merangkum apa yang sudah dibahas.

                    ATURAN OUTPUT:
                    1. Kamu ADALAH mesin chatbot tutor professional.
                    2. Jawab HANYA dalam format JSON murni.
                    3. DILARANG memberikan teks penjelasan, pembukaan, atau penutup.
                    4. DILARANG menggunakan markdown code blocks (\`\`\`json).

                    STRUKTUR JSON:
                    {
                    "answer": (string) Jawaban AI terhadap pertanyaan terakhir,
                    "summary_so_far": (string) Ringkasan singkat topik yang sedang dibahas dalam percakapan ini,
                    "suggested_action": (string) Saran langkah selanjutnya untuk user
                    }`,
            messages: formattedMessages
        })

        if (!text) return ({success: false, message: "Failed to analyze image"})
        
        const parsedRes = await ParseTextOutput(text)

        console.log(parsedRes.answer)

        if (parsedRes && parsedRes.answer) {
            return ({ success: true, data: parsedRes });
        } 

        return {
            success: true,
            data: {
            answer: text, // Masukkan seluruh teks sebagai jawaban
            summary_so_far: "Melanjutkan diskusi mengenai proyek...",
            suggested_action: "Model memberikan feedback berupa string langsung"
            }
        };
}

export default GetAnswer