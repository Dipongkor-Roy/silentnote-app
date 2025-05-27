/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "startup-template-sage.vercel.app",
      "dashboardsdesign.com",
      "api.dicebear.com",
      "vercel.com",
      "avatar.vercel.sh",
      "ansubkhan.com",
      "blog.olivierlarose.com",
      "res.cloudinary.com",
    ],
  },
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
