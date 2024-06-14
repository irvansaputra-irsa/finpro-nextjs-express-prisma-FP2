/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:8000/api',
    NEXT_PUBLIC_IMAGE_URL: 'http://localhost:8000/images',
    MAX_FILE_SIZE: '1000000',
  },
};

module.exports = nextConfig;
