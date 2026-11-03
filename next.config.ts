import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

// Set STATIC_EXPORT=1 to produce the IPFS shell. Unset, the build is the
// normal server app that Vercel needs.
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default withSentryConfig(nextConfig, {
  org: "merchandmemes",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // The tunnel needs a rewrite, which a static export has no server for.
  ...(isStaticExport ? {} : { tunnelRoute: "/monitoring" }),

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
