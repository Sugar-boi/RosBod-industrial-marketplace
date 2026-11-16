import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";


const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [
    {
      url: "/~offline",
      revision: crypto.randomUUID(),
    },
  ],
  // SW only in production — avoids stale cache in `next dev`
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSerwist(nextConfig);
