import * as path from "path";
import { workspace, ExtensionContext } from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;

export async function activate(_context: ExtensionContext) {
  // We need to go one level up since an extension compile the js code into
  // the output folder.
  let serverModulePath = path.join(__dirname, "..", "server", "server.js");
  let debugOptions = {
    execArgv: ["--nolazy", "--inspect=6010"],
    cwd: process.cwd(),
  };
  let serverOptions: ServerOptions = {
    run: { module: serverModulePath, transport: TransportKind.ipc },
    debug: {
      module: serverModulePath,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  };

  // Get file types to lint from user settings
  let config = workspace.getConfiguration("htmlhint");
  let languages: string[] = config.get("documentSelector") || ["html", "htm"];
  let documentSelector = languages.map((language) => ({
    language,
    scheme: "file",
  }));

  // Set options
  let clientOptions: LanguageClientOptions = {
    documentSelector,
    diagnosticCollectionName: "htmlhint",
    synchronize: {
      configurationSection: "htmlhint",
      fileEvents: [
        workspace.createFileSystemWatcher("**/.htmlhintrc"),
        workspace.createFileSystemWatcher("**/.htmlhintrc.json"),
      ],
    },
  };

  // Create the language client and start it
  client = new LanguageClient(
    "HTML-hint",
    "HTML-hint",
    serverOptions,
    clientOptions,
  );

  // Start the client
  await client.start();
}

export async function deactivate(): Promise<void> {
  if (!client) {
    return;
  }
  return client.stop();
}
