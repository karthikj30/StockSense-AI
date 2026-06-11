import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  serverExternalPackages: ["yahoo-finance2"],
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
