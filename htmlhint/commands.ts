import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

const defaultConfig = {
  "tagname-lowercase": true,
  "attr-lowercase": true,
  "attr-value-double-quotes": true,
  "doctype-first": true,
  "tag-pair": true,
  "spec-char-escape": true,
  "id-unique": true,
  "src-not-empty": true,
  "attr-no-duplication": true,
  "title-require": true,
};

export async function createHtmlHintConfig() {
  try {
    // Get the current workspace folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      vscode.window.showErrorMessage("No workspace folder is open");
      return;
    }

    const firstWorkspaceFolder = workspaceFolders[0];
    if (!firstWorkspaceFolder) {
      vscode.window.showErrorMessage("Invalid workspace folder");
      return;
    }

    const workspaceRoot = firstWorkspaceFolder.uri.fsPath;
    const configPath = path.join(workspaceRoot, ".htmlhintrc");

    try {
      // Try to create the file atomically
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), {
        flag: "wx",
      });
      vscode.window.showInformationMessage(
        ".htmlhintrc configuration file created successfully",
      );
    } catch (error) {
      // If file exists, ask for overwrite
      if ((error as NodeJS.ErrnoException).code === "EEXIST") {
        const overwrite = await vscode.window.showWarningMessage(
          ".htmlhintrc already exists. Do you want to overwrite it?",
          "Yes",
          "No",
        );
        if (overwrite === "Yes") {
          fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
          vscode.window.showInformationMessage(
            ".htmlhintrc configuration file updated successfully",
          );
        }
      } else {
        throw error;
      }
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to create .htmlhintrc: ${error}`);
  }
}
