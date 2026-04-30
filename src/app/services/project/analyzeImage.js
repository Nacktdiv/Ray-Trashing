'use server'

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

async function AnalyzeImage (base64Image) {
//      const datatest = {
//   "mudah": [
//     "Dekorasi Dinding Estetik: Bunga atau bentuk geometris dari potongan dasar botol PET yang dicat atau diwarnai, dapat dijual sebagai hiasan dinding atau pajangan.",
//     "Penyelenggara Meja Multifungsi: Botol PET dipotong dan dihias menjadi tempat pensil, tempat sikat gigi, atau wadah penyimpanan alat tulis kecil, dipasarkan untuk rumah tangga atau kantor.",
//     "Lampu Hias Minimalis: Botol PET utuh atau sebagian diubah menjadi kap lampu gantung atau lentera meja dengan penambahan lampu LED kecil, fokus pada desain modern/minimalis."
//   ],
//   "sedang": [
//     "Furniture Modular Outdoor: Botol PET diisi dengan pasir atau bahan padat lainnya, diikat kuat menjadi balok-balok, kemudian dilapisi kain tahan air atau anyaman rotan sintetis untuk membuat bangku atau meja kopi outdoor yang ringan dan tahan lama.",
//     "Sistem Urban Farming Vertikal: Rak atau modul pot vertikal dari botol PET yang dipotong dan disambungkan, dirancang untuk menanam sayuran atau herbal di lahan terbatas, dijual sebagai solusi berkebun di perkotaan.",
//     "Aksesori Fashion Daur Ulang: Bagian botol (misalnya dasar atau leher) diolah dan dipadukan dengan material lain untuk membuat tas, dompet, atau perhiasan unik dengan tema \"eco-friendly\"."
//   ],
//   "sulit": [
//     "Bahan Bangunan Inovatif (Eco-Panel): Botol PET dicacah, dilebur, dan dicetak menjadi panel isolasi atau papan komposit yang dapat digunakan dalam konstruksi non-struktural, dipasarkan sebagai material ramah lingkungan.",
//     "Filamen Printer 3D dari PET Daur Ulang: Mengembangkan proses untuk mengubah botol PET menjadi filamen yang dapat digunakan oleh printer 3D, menargetkan pasar DIY, maker, atau industri prototyping.",
//     "Tekstil Daur Ulang Kualitas Tinggi: Memproduksi serat PET daur ulang yang kemudian diolah menjadi benang dan kain untuk industri fashion atau tekstil rumah tangga, menekankan keberlanjutan dan kualitas premium."
//   ],
//   "bahan_terdeteksi": "Plastik PET (botol air minum)"
// }

//     if (!base64Image) return ({success: false, message: "No image provided"})

//     return ({success: true, data: datatest})

    const {text} = await generateText({
        model: google('gemma-3-27b-it'),
        messages: [
            {
                role:'user',
                content: [
                    {
                        type: 'text', 
                        text: `Tugas: Analisis sampah dalam gambar ini secara mendalam. 
                                1. Identifikasi jenis bahan (Plastik, Kertas, Logam, atau lainnya).
                                2. Estimasikan berat sampah tersebut dalam satuan kilogram.
                                3. Hitung estimasi emisi CO2 yang berhasil dicegah (dalam kg) jika bahan tersebut diolah kembali melalui ekonomi sirkular.
                                4. Berikan masing-masing 3 ide proyek kreatif yang memiliki nilai jual tinggi untuk kategori Mudah, Sedang, dan Sulit

                                ATURAN OUTPUT:
                                1. Kamu ADALAH mesin validator.
                                2. Jawab HANYA dalam format JSON murni.
                                3. DILARANG memberikan teks penjelasan, pembukaan, atau penutup.
                                4. DILARANG menggunakan markdown code blocks (\`\`\`json).
                                5. Deskripsi proyek harus singkat dan padat (max 3-4 kata), contoh: "Pot Gantung Este

                                STRUKTUR JSON:
                                {
                                "mudah": [pilihan 1, pilihan2, pilihan3],
                                "sedang":[pilihan 1, pilihan2, pilihan3],
                                "sulit": [pilihan 1, pilihan2, pilihan3],
                                "bahan_terdeteksi": berupa string,
                                "estimasi_berat_kg": number,
                                "emisi_co2_dicegah_kg": number
                                }`
                    },
                    { type: 'image', image: base64Image }
                ]
            }
        ]
    })

    if (!text) return ({success:false, message:"Respon text dari gemma tidak sesuai atau error"})

    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedRes = await JSON.parse(cleanJson)

    return ({success: true, data: parsedRes})
  
}

export default AnalyzeImage