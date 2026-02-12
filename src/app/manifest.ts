import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: "ERP",
    name: 'ERP APEC GLOBAL',
    description: 'APEC GLOBAL - Kiến tạo giá trị - Làm Chủ Tương Lai',
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
