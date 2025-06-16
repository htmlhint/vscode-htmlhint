import * as path from "path";
import Mocha from "mocha";
import * as glob from "glob";

export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: "bdd",
    color: true,
    timeout: 10000,
  });

  const testsRoot = path.resolve(__dirname, "..", "suite");

  return new Promise((resolve, reject) => {
    glob
      .glob("**/*.test.js", { cwd: testsRoot })
      .then((files: string[]) => {
        files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)));
        try {
          mocha.run((failures) => {
            if (failures > 0) {
              reject(new Error(`${failures} tests failed.`));
            } else {
              resolve();
            }
          });
        } catch (err) {
          reject(err);
        }
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
}
