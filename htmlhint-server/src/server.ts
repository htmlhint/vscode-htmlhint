"use strict";

/// <reference path="typings-custom/thenable.d.ts" />
/// <reference path="typings-custom/htmlhint.d.ts" />

import * as path from "path";
import {
  createConnection,
  TextDocuments,
  Diagnostic,
  DiagnosticSeverity,
  ProposedFeatures,
  InitializeParams,
  TextDocumentSyncKind,
  InitializeResult,
  Connection,
  ErrorMessageTracker,
  CancellationToken,
  CodeActionParams,
  Command,
  CodeAction,
  CodeActionKind,
  TextEdit,
  WorkspaceEdit,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import * as htmlhint from "htmlhint";
import fs = require("fs");
let stripJsonComments: any = require("strip-json-comments");

interface Settings {
  htmlhint: {
    configFile: string;
    enable: boolean;
    options: any;
    optionsFile: string;
  };
  [key: string]: any;
}

let settings: Settings | null = null;
let linter: any = null;

/**
 * This variable is used to cache loaded htmlhintrc objects.  It is a dictionary from path -> config object.
 * A value of null means a .htmlhintrc object didn't exist at the given path.
 * A value of undefined means the file at this path hasn't been loaded yet, or should be reloaded because it changed
 */
let htmlhintrcOptions: any = {};

/**
 * Given an htmlhint Error object, approximate the text range highlight
 */
function getRange(error: htmlhint.Error, lines: string[]): any {
  let line = lines[error.line - 1];
  if (!line) {
    // Fallback if line doesn't exist
    return {
      start: {
        line: error.line - 1,
        character: error.col - 1,
      },
      end: {
        line: error.line - 1,
        character: error.col - 1,
      },
    };
  }

  let isWhitespace = false;
  let curr = error.col;
  while (curr < line.length && !isWhitespace) {
    let char = line[curr];
    isWhitespace =
      char === " " ||
      char === "\t" ||
      char === "\n" ||
      char === "\r" ||
      char === "<";
    ++curr;
  }

  if (isWhitespace) {
    --curr;
  }

  return {
    start: {
      line: error.line - 1, // Html-hint line numbers are 1-based.
      character: error.col - 1,
    },
    end: {
      line: error.line - 1,
      character: curr,
    },
  };
}

/**
 * Given an htmlhint.Error type return a VS Code server Diagnostic object
 */
function makeDiagnostic(problem: htmlhint.Error, lines: string[]): Diagnostic {
  return {
    severity: DiagnosticSeverity.Warning,
    message: problem.message,
    range: getRange(problem, lines),
    code: problem.rule.id,
    source: 'htmlhint',
    data: {
      ruleId: problem.rule.id,
      line: problem.line,
      col: problem.col,
    }
  };
}

/**
 * Get the HTMLHint configuration settings for the given HTML file.  This method will take care of whether to use
 * VS Code settings, or to use a .htmlhintrc file.
 */
function getConfiguration(filePath: string): any {
  let options: any;
  if (settings?.htmlhint) {
    if (
      settings.htmlhint.configFile &&
      settings.htmlhint.options &&
      Object.keys(settings.htmlhint.options).length > 0
    ) {
      throw new Error(
        `The configuration settings for HTMLHint are invalid. Please specify either 'htmlhint.configFile' or 'htmlhint.options', but not both.`,
      );
    }
    if (settings.htmlhint.configFile) {
      if (fs.existsSync(settings.htmlhint.configFile)) {
        options = loadConfigurationFile(settings.htmlhint.configFile);
      } else {
        const configFileHint = !path.isAbsolute(settings.htmlhint.configFile)
          ? ` (resolves to '${path.resolve(settings.htmlhint.configFile)}')`
          : "";
        throw new Error(
          `The configuration settings for HTMLHint are invalid. The file '${settings.htmlhint.configFile}'${configFileHint} specified in 'htmlhint.configFile' could not be found.`,
        );
      }
    } else if (
      settings.htmlhint.options &&
      Object.keys(settings.htmlhint.options).length > 0
    ) {
      options = settings.htmlhint.options;
    } else if (settings.htmlhint && settings.htmlhint.optionsFile) {
      options = loadConfigurationFile(settings.htmlhint.optionsFile);
    } else {
      options = findConfigForHtmlFile(filePath);
    }
  } else {
    options = findConfigForHtmlFile(filePath);
  }

  options = options || {};
  return options;
}

/**
 * Given the path of an HTML file, this function will look in current directory & parent directories
 * to find a .htmlhintrc file to use as the linter configuration.  The settings are
 */
function findConfigForHtmlFile(base: string) {
  let options: any;

  if (fs.existsSync(base)) {
    // find default config file in parent directory
    if (fs.statSync(base).isDirectory() === false) {
      base = path.dirname(base);
    }

    while (base) {
      let tmpConfigFile = path.resolve(base + path.sep, ".htmlhintrc");

      // undefined means we haven't tried to load the config file at this path, so try to load it.
      if (htmlhintrcOptions[tmpConfigFile] === undefined) {
        htmlhintrcOptions[tmpConfigFile] = loadConfigurationFile(tmpConfigFile);
      }

      // defined, non-null value means we found a config file at the given path, so use it.
      if (htmlhintrcOptions[tmpConfigFile]) {
        options = htmlhintrcOptions[tmpConfigFile];
        break;
      }

      base = base.substring(0, base.lastIndexOf(path.sep));
    }
  }
  return options;
}

/**
 * Given a path to a .htmlhintrc file, load it into a javascript object and return it.
 */
function loadConfigurationFile(configFile: string): any {
  let ruleset: any = null;
  if (fs.existsSync(configFile)) {
    let config = fs.readFileSync(configFile, "utf8");
    try {
      ruleset = JSON.parse(stripJsonComments(config));
    } catch (e) {}
  }
  return ruleset;
}

function isErrorWithMessage(err: unknown): err is { message: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as Record<string, unknown>).message === "string"
  );
}

function getErrorMessage(err: unknown, document: TextDocument): string {
  if (isErrorWithMessage(err)) {
    return err.message;
  }

  return `An unknown error occurred while validating file: ${document.uri}`;
}

function validateAllTextDocuments(
  connection: Connection,
  documents: TextDocument[],
): void {
  let tracker = new ErrorMessageTracker();
  documents.forEach((document) => {
    try {
      validateTextDocument(connection, document);
    } catch (err) {
      tracker.add(getErrorMessage(err, document));
    }
  });
  tracker.sendErrors(connection);
}

function validateTextDocument(
  connection: Connection,
  document: TextDocument,
): void {
  try {
    doValidate(connection, document);
  } catch (err) {
    connection.window.showErrorMessage(getErrorMessage(err, document));
  }
}

let connection: Connection = createConnection(ProposedFeatures.all);
let documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
documents.listen(connection);

function trace(message: string, verbose?: string): void {
  connection.tracer.log(message, verbose);
}

/**
 * Create auto-fix action for html-lang-require rule
 */
function createHtmlLangRequireFix(document: TextDocument, diagnostic: Diagnostic): CodeAction | null {
  if (!diagnostic.data || diagnostic.data.ruleId !== 'html-lang-require') {
    return null;
  }

  const text = document.getText();
  const htmlTagMatch = text.match(/<html(\s[^>]*)?>/i);

  if (!htmlTagMatch) {
    return null;
  }

  const htmlTagStart = htmlTagMatch.index!;
  const htmlTag = htmlTagMatch[0];

  // Check if lang attribute already exists
  const langAttrMatch = htmlTag.match(/\slang\s*=\s*["'][^"']*["']/i);
  if (langAttrMatch) {
    return null; // Lang attribute already exists
  }

  // Calculate position to insert lang attribute
  const insertPosition = document.positionAt(htmlTagStart + 5); // After "<html"
  const newText = ' lang="en"';

  const edit: TextEdit = {
    range: {
      start: insertPosition,
      end: insertPosition
    },
    newText: newText
  };

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: [edit]
    }
  };

  return {
    title: 'Add lang="en" attribute to html tag',
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true
  };
}

/**
 * Create auto-fix action for title-require rule
 */
function createTitleRequireFix(document: TextDocument, diagnostic: Diagnostic): CodeAction | null {
  if (!diagnostic.data || diagnostic.data.ruleId !== 'title-require') {
    return null;
  }

  const text = document.getText();
  const headMatch = text.match(/<head(\s[^>]*)?>([\s\S]*?)<\/head>/i);

  if (!headMatch) {
    return null;
  }

  const headContent = headMatch[2];
  const titleMatch = headContent.match(/<title(\s[^>]*)?>/i);

  if (titleMatch) {
    return null; // Title tag already exists
  }

  // Find a good position to insert the title tag (after meta charset if it exists, otherwise at the beginning of head)
  const headStart = headMatch.index! + headMatch[0].indexOf('>') + 1;
  const metaCharsetMatch = headContent.match(/<meta\s+charset\s*=\s*["'][^"']*["'][^>]*>/i);

  let insertPosition: number;
  let newText: string;

  if (metaCharsetMatch) {
    const metaCharsetEnd = headStart + metaCharsetMatch.index! + metaCharsetMatch[0].length;
    insertPosition = metaCharsetEnd;
    newText = '\n    <title>Document</title>';
  } else {
    insertPosition = headStart;
    newText = '\n    <title>Document</title>';
  }

  const edit: TextEdit = {
    range: {
      start: document.positionAt(insertPosition),
      end: document.positionAt(insertPosition)
    },
    newText: newText
  };

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: [edit]
    }
  };

  return {
    title: 'Add <title> tag',
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true
  };
}

/**
 * Create auto-fix action for attr-value-double-quotes rule
 */
function createAttrValueDoubleQuotesFix(document: TextDocument, diagnostic: Diagnostic): CodeAction | null {
  if (!diagnostic.data || diagnostic.data.ruleId !== 'attr-value-double-quotes') {
    return null;
  }

  const text = document.getText();
  const lines = text.split('\n');
  const line = lines[diagnostic.data.line - 1];

  if (!line) {
    return null;
  }

  // Find single-quoted attributes and replace with double quotes
  const singleQuotePattern = /(\w+)='([^']*)'/g;
  let match;
  const edits: TextEdit[] = [];

  while ((match = singleQuotePattern.exec(line)) !== null) {
    const startCol = match.index;
    const endCol = startCol + match[0].length;
    const attrName = match[1];
    const attrValue = match[2];

    // Check if this match is at or near the diagnostic position
    const diagnosticCol = diagnostic.data.col - 1;
    if (Math.abs(startCol - diagnosticCol) <= 10) {
      const lineStartPos = document.positionAt(text.split('\n').slice(0, diagnostic.data.line - 1).join('\n').length + (diagnostic.data.line > 1 ? 1 : 0));
      const startPos = { line: lineStartPos.line, character: startCol };
      const endPos = { line: lineStartPos.line, character: endCol };

      edits.push({
        range: { start: startPos, end: endPos },
        newText: `${attrName}="${attrValue}"`
      });
      break;
    }
  }

  if (edits.length === 0) {
    return null;
  }

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: edits
    }
  };

  return {
    title: 'Change attribute quotes to double quotes',
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true
  };
}

/**
 * Create auto-fix actions for supported rules
 */
function createAutoFixes(document: TextDocument, diagnostics: Diagnostic[]): CodeAction[] {
  const actions: CodeAction[] = [];

  for (const diagnostic of diagnostics) {
    if (!diagnostic.data || !diagnostic.data.ruleId) {
      continue;
    }

    let fix: CodeAction | null = null;

    switch (diagnostic.data.ruleId) {
      case 'html-lang-require':
        fix = createHtmlLangRequireFix(document, diagnostic);
        break;
      case 'title-require':
        fix = createTitleRequireFix(document, diagnostic);
        break;
      case 'attr-value-double-quotes':
        fix = createAttrValueDoubleQuotesFix(document, diagnostic);
        break;
      // Add more rules here as needed
    }

    if (fix) {
      actions.push(fix);
    }
  }

  return actions;
}

connection.onInitialize(
  (params: InitializeParams, token: CancellationToken) => {
    let rootFolder = params.rootPath;
    let initOptions: {
      nodePath: string;
    } = params.initializationOptions;
    let nodePath = initOptions
      ? initOptions.nodePath
        ? initOptions.nodePath
        : undefined
      : undefined;

    // Since Files API is no longer available, we'll use embedded htmlhint directly
    linter = htmlhint.default || htmlhint.HTMLHint || htmlhint;

    let result: InitializeResult = {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        codeActionProvider: {
          codeActionKinds: [CodeActionKind.QuickFix]
        }
      },
    };
    return result;
  },
);

function doValidate(connection: Connection, document: TextDocument): void {
  try {
    let uri = document.uri;
    // Convert URI to file path manually since Files API is not available
    let fsPath = uri.replace(/^file:\/\//, "");
    if (process.platform === "win32" && fsPath.startsWith("/")) {
      fsPath = fsPath.substring(1);
    }
    let contents = document.getText();
    let lines = contents.split("\n");

    let config = getConfiguration(fsPath);

    let errors: htmlhint.Error[] = linter.verify(contents, config);

    let diagnostics: Diagnostic[] = [];
    if (errors.length > 0) {
      errors.forEach((each) => {
        diagnostics.push(makeDiagnostic(each, lines));
      });
    }
    connection.sendDiagnostics({ uri, diagnostics });
  } catch (err) {
    if (isErrorWithMessage(err)) {
      throw new Error(err.message);
    }
    throw err;
  }
}

// A text document has changed. Validate the document.
documents.onDidChangeContent((event) => {
  // the contents of a text document has changed
  validateTextDocument(connection, event.document);
});

// Send an empty array of diagnostics to stop displaying them on a closed file
connection.onDidCloseTextDocument((event) => {
  const uri = event.textDocument.uri;
  connection.sendDiagnostics({ uri, diagnostics: [] });
});

// The VS Code htmlhint settings have changed. Revalidate all documents.
connection.onDidChangeConfiguration((params) => {
  settings = params.settings;

  validateAllTextDocuments(connection, documents.all());
});

// The watched .htmlhintrc has changed. Clear out the last loaded config, and revalidate all documents.
connection.onDidChangeWatchedFiles((params) => {
  for (let i = 0; i < params.changes.length; i++) {
    // Convert URI to file path manually since Files API is not available
    let uri = params.changes[i].uri;
    let fsPath = uri.replace(/^file:\/\//, "");
    if (process.platform === "win32" && fsPath.startsWith("/")) {
      fsPath = fsPath.substring(1);
    }
    htmlhintrcOptions[fsPath] = undefined;
  }
  validateAllTextDocuments(connection, documents.all());
});

// Handle code action requests for auto-fixes
connection.onCodeAction((params: CodeActionParams) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return [];
  }

  // Filter diagnostics to only include HTMLHint diagnostics in the requested range
  const htmlhintDiagnostics = params.context.diagnostics.filter(
    diagnostic => diagnostic.source === undefined || diagnostic.source === 'htmlhint'
  );

  return createAutoFixes(document, htmlhintDiagnostics);
});

connection.listen();
