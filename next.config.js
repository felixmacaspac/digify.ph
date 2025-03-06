/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
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
          {
            key: "X-Frame-Options",
            value: "DENY", // Prevent clickjacking attacks
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // Prevent MIME-type sniffing
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin", // Protect referrer info
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload", // Enforce HTTPS
          },

        ],
      },
    ];
  },
};

module.exports = nextConfig;
