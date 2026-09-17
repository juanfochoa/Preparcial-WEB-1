import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permitimos cargar imágenes desde el dominio de DummyJSON
  // porque Next.js bloquea imágenes externas por defecto
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
      },
    ],
  },
};

export default nextConfig;
