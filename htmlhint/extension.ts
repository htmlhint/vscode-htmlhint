import * as path from "path";
import * as vscode from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
  Diagnostic as LSPDiagnostic,
} from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
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
  let config = vscode.workspace.getConfiguration("htmlhint");
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
        vscode.workspace.createFileSystemWatcher("**/.htmlhintrc"),
        vscode.workspace.createFileSystemWatcher("**/.htmlhintrc.json"),
      ],
    },
    middleware: {
      handleDiagnostics: (uri, diagnostics, next) => {
        const enhancedDiagnostics = diagnostics.map((diagnostic) => {
          const lspDiagnostic = diagnostic as unknown as LSPDiagnostic;
          if (lspDiagnostic.data?.href) {
            const vscodeDiagnostic = new vscode.Diagnostic(
              diagnostic.range,
              diagnostic.message,
              diagnostic.severity,
            );
            if (diagnostic.source) {
              vscodeDiagnostic.source = diagnostic.source;
            }
            vscodeDiagnostic.code = {
              value: diagnostic.code as string,
              target: vscode.Uri.parse(lspDiagnostic.data.href),
            };
            return vscodeDiagnostic;
          }
          return diagnostic;
        });
        return next(uri, enhancedDiagnostics);
      },
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
  client.start();
  context.subscriptions.push(client);
}

export async function deactivate(): Promise<void> {
  if (!client) {
    return;
  }
  return client.stop();
}
