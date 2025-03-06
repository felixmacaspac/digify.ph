/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lugsovqbczuivdotdlnd.supabase.co"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: ${process.env.NEXT_PUBLIC_SUPABASE_URL};
              font-src 'self' https://fonts.gstatic.com;
              connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL};
              frame-ancestors 'none';
              base-uri 'self';
              form-action 'self';
            `.replace(/\s{2,}/g, " "), // Minify CSP
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
