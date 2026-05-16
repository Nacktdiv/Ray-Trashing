// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
//   reactCompiler: true,
//   allowedDevOrigins: [
//     "http://localhost:3000", 
//     "192.168.1.8", 
//     "*.ngrok-free.dev",   // Mengizinkan semua subdomain ngrok
//     "*.ngrok-free.app"    // Berjaga-jaga jika ngrok ganti domain utama
//   ],
// };

// export default nextConfig;
const nextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [
    "http://localhost:3000", 
    "192.168.1.8", 
    "*.ngrok-free.dev", 
    "*.ngrok-free.app"
  ],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            // Kita tambahkan 'unsafe-eval' dan domain-domain Midtrans agar script Snap bisa jalan
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.sandbox.midtrans.com https://api.sandbox.midtrans.com https://snap-assets.al-pc-id-b.cdn.gtflabs.io https://pay.google.com https://gwk.gopayapi.com; object-src 'none';"
          }
        ]
      }
    ];
  }
};

export default nextConfig;