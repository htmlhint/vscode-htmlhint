import { suite, test } from "mocha";
import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";

suite("HTMLHint Test Suite", () => {
  // test("Should detect HTML linting errors", async () => {
  //   const doc = await vscode.workspace.openTextDocument({
  //     content: '<div class="test">\n<p>Test</p>\n<img src="test.jpg">\n</div>',
  //     language: 'html'
  //   });

  //   const editor = await vscode.window.showTextDocument(doc);

  //   // Wait for diagnostics to be generated
  //   await new Promise(resolve => setTimeout(resolve, 7000));

  //   const diagnostics = vscode.languages.getDiagnostics(doc.uri);
  //   assert.strictEqual(diagnostics.length > 0, true, 'Should have diagnostics');
  // });

  test("Should load configuration from .htmlhintrc", async () => {
    // Wait a bit for workspace to initialize
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    if (!workspaceFolder) {
      // If no workspace folder, try to find the test config file directly
      const testConfigPath = path.resolve(
        __dirname,
        "../../../test/testConfigFile/.htmlhintrc",
      );
      let configExists = false;
      try {
        await vscode.workspace.fs.stat(vscode.Uri.file(testConfigPath));
        configExists = true;
      } catch {
        configExists = false;
      }
      assert.strictEqual(
        configExists,
        true,
        ".htmlhintrc should exist in test config directory",
      );
      return;
    }

    const configPath = path.join(workspaceFolder.uri.fsPath, ".htmlhintrc");
    let configExists = false;
    try {
      await vscode.workspace.fs.stat(vscode.Uri.file(configPath));
      configExists = true;
    } catch {
      configExists = false;
    }

    assert.strictEqual(configExists, true, ".htmlhintrc should exist");
  });
});
