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
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    assert.ok(workspaceFolder, "Workspace folder should exist");

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
