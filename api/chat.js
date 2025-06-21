// File: /api/chat.js
// VERSI TIDAK AMAN - HANYA UNTUK TES LOKAL!

const { GoogleGenerativeAI } = require('@google/gemini-2.0-flash');

// --- TEMPATKAN API KEY ANDA DI SINI ---
// Ganti "API_KEY_ANDA_DI_SINI" dengan kunci API Anda yang sebenarnya.
const API_KEY = "AIzaSyB7N4clwhG_vyzfKUJpsgQWZQK-wLY3F_Q"; 
// ------------------------------------

// Inisialisasi Gemini AI dengan API Key yang ditulis langsung
const genAI = new GoogleGenerativeAI(API_KEY);

// Konteks Perusahaan (Otak dari Chatbot)
const companyContext = `
Anda adalah "A.M.I", asisten AI yang ramah dan profesional dari Amettha MEDIA, sebuah divisi dari PT THOR INSPIRA QREATIVA. 
Tugas Anda adalah menjawab pertanyaan pengguna tentang perusahaan dan layanannya berdasarkan informasi berikut. 
Jawab dengan singkat, jelas, dan dalam Bahasa Indonesia. 
Jangan mengarang informasi di luar konteks ini.

--- INFORMASI PERUSAHAAN ---
- Nama Perusahaan Induk: PT THOR INSPIRA QREATIVA (THOR.iQ)
- Divisi Utama & Brand: Amettha MEDIA
- Fokus: Solusi digital, kecerdasan buatan (AI), dan transformasi konten dengan pendekatan human-centric.
- Visi: Menjadi pelopor transformasi digital humanistik melalui kreativitas, teknologi, dan kolaborasi.
- Nilai: Inovatif & Berbasis Data, Kolaboratif & Transparan, AI untuk Kemanusiaan, Kreativitas yang Bertanggung Jawab.
- CEO: Thoris Mannoor, B.Mus,Ed.
- Manager Amettha MEDIA: Akbar Ramadhan

--- LAYANAN KAMI ---
1. Produksi Konten Digital & Multimedia: Desain grafis, animasi, video promosi, audio branding, storytelling.
2. Manajemen Media Sosial & Branding: Strategi konten, AI captioning, penjadwalan.
3. Pengelolaan Toko Online & Marketplace: Optimalisasi etalase, branding produk UMKM.
4. Pelatihan & Edukasi Teknologi Digital: Pelatihan AI, media digital, personal branding.
5. Integrasi & Automasi Bisnis Mikro: Implementasi AI Assistant, chatbot, automasi pemasaran.

--- KONTAK ---
- Email: thoriqnusantara01@gmail.com
- Instagram: @ametthamedia
- TikTok: @amettha.media
- LinkedIn: amettha-media
---
`;

// Handler function yang akan dijalankan
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Periksa apakah API Key sudah diisi
    if (API_KEY === "API_KEY_ANDA_DI_SINI") {
        return res.status(500).json({ error: "API Key belum diatur di dalam file /api/chat.js" });
    }

    try {
        const { message: userMessage } = req.body;
        if (!userMessage) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: companyContext }] },
                { role: "model", parts: [{ text: "Siap! Saya adalah A.M.I. Saya akan menjawab semua pertanyaan berdasarkan informasi yang Anda berikan." }] }
            ]
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });

    } catch (error) {
        console.error("Error in function:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server AI. Periksa kembali API Key Anda." });
    }
};
