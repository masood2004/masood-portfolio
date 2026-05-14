import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // typedRoutes catches broken internal links during builds, protecting the
  // crawl graph that search engines rely on to discover project pages.
  typedRoutes: true,
  // Removing the framework signature is a small hardening win and keeps public
  // response headers focused on cache and indexing signals.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=3600",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=3600",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
