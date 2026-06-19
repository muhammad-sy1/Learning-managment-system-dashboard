import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bayanmasters-store-admin.bayanmasters.com",
        port: "",
        pathname: "/storage/**",
      },
    ],
    unoptimized: true,      // required for export
  },
  output: "export",         // required for static hosting
  trailingSlash: true,      // makes URLs map to /folder/index.html reliably
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
