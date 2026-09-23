const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");
const serverOnly = process.argv.includes("--server");

const sharedOptions = {
  bundle: true,
  format: "cjs",
  logLevel: "info",
  minify: production,
  platform: "node",
  sourcemap: !production,
  sourcesContent: false,
  target: "node22",
};

const extensionBuild = {
  ...sharedOptions,
  entryPoints: [path.join(__dirname, "extension.ts")],
  external: ["vscode"],
  outfile: path.join(__dirname, "out", "extension.js"),
};

const serverBuild = {
  ...sharedOptions,
  entryPoints: [
    path.join(__dirname, "..", "htmlhint-server", "src", "server.ts"),
  ],
  outfile: path.join(__dirname, "server", "server.js"),
};

const builds = serverOnly ? [serverBuild] : [extensionBuild, serverBuild];

async function main() {
  for (const options of builds) {
    fs.rmSync(path.dirname(options.outfile), { recursive: true, force: true });
  }

  const contexts = await Promise.all(
    builds.map((options) => esbuild.context(options)),
  );

  if (watch) {
    await Promise.all(contexts.map((ctx) => ctx.watch()));
    return;
  }

  await Promise.all(contexts.map((ctx) => ctx.rebuild()));
  await Promise.all(contexts.map((ctx) => ctx.dispose()));
}

main().catch((error) => {
  process.exitCode = 1;
  throw error;
});
