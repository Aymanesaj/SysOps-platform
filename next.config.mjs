/** @type {import('next').NextConfig} */
const nextConfig = {
    // CRITICAL: This allows the Dockerfile to find the /standalone folder
    output: 'standalone',
    
    // This helps prevent issues with styled-components or specific libraries
    poweredByHeader: false,
    
    // Optional: If you use images from GitHub avatars, add this
    images: {
      domains: ['avatars.githubusercontent.com'],
    },
  };
  
  export default nextConfig;