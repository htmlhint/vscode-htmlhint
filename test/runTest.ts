import * as path from "path";
import { runTests } from "vscode-test";

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, "../htmlhint");

    // The path to the test runner
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, "./suite/index");

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      version: "1.89.0",
      platform: "win32-x64-archive",
    });
  } catch (err) {
    console.error("Failed to run tests");
    process.exit(1);
  }
}

main();
