import { build as esbuild } from "esbuild";
import { rm, readFile } from "fs/promises";

// server deps to bundle to reduce openat(2) syscalls
const allowlist: string[] = [
  "@google/generative-ai",
  "@neondatabase/serverless",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildServer(): Promise<void> {
  console.log("Cleaning dist directory...");
  await rm("dist", { recursive: true, force: true });
  
  console.log("Building server only...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8")) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: false,
    external: externals,
    logLevel: "info",
  });

  console.log("Server build completed successfully!");
}

buildServer().catch((err: Error) => {
  console.error("Build failed:", err);
  process.exit(1);
});
