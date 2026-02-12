import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Meta Link",
    short_name: "MetaLink",
    description: "Hệ thống quản lý và theo dõi các dự án web",
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
