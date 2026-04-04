import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { runTests } from "@vscode/test-electron";

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, "../../htmlhint");

    // The path to the test runner
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, "./suite/index");
    const tempRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), "vscode-htmlhint-tests-"),
    );
    const extensionTestsEnvPath = path.join(tempRoot, "extensions");
    const userDataDir = path.join(tempRoot, "user-data");
    const extensionPackageJsonPath = path.resolve(
      __dirname,
      "../../htmlhint/package.json",
    );

    fs.mkdirSync(extensionTestsEnvPath, { recursive: true });
    fs.mkdirSync(userDataDir, { recursive: true });

    const extensionPackageJson = JSON.parse(
      fs.readFileSync(extensionPackageJsonPath, "utf8"),
    ) as {
      engines: { vscode: string };
    };
    const vscodeVersion = extensionPackageJson.engines.vscode.replace(
      /^[^\d]*/,
      "",
    );

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [
        path.resolve(__dirname, "../test/testConfigFile"),
        "--extensions-dir",
        extensionTestsEnvPath,
        "--user-data-dir",
        userDataDir,
      ],
      version: vscodeVersion,
    });
  } catch (err) {
    console.error("Failed to run tests", err);
    process.exit(1);
  }
}

main();
