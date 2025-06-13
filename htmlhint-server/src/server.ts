"use strict";

/// <reference path="typings-custom/thenable.d.ts" />
/// <reference path="typings-custom/htmlhint.d.ts" />

/**
 * HTMLHint Language Server
 *
 * DEBUGGING: To enable debug traces for development/troubleshooting:
 * 1. Search for "// trace(" in this file
 * 2. Uncomment the trace() calls you want to enable
 * 3. Recompile with: npm run compile
 * 4. Check Output > HTMLHint channel in VS Code for debug messages
 *
 * Debug categories available:
 * - Config loading and file watching
 * - Auto-fix function execution
 * - Document validation and diagnostics
 */

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
  CodeDescription,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import * as htmlhint from "htmlhint";
import fs = require("fs");
import { URI } from "vscode-uri";
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
function makeDiagnostic(
  problem: htmlhint.Error,
  document: TextDocument,
): Diagnostic {
  const lines = document.getText().split("\n");
  const col = problem.col - 1;
  const endCol = problem.col + (problem.raw?.length || 0) - 1;

  const range = {
    start: { line: problem.line - 1, character: col },
    end: { line: problem.line - 1, character: endCol },
  };

  return {
    range,
    message: problem.message,
    severity: DiagnosticSeverity.Warning,
    source: "htmlhint",
    code: problem.rule.id,
    data: {
      ruleId: problem.rule.id,
      href: `https://htmlhint.com/rules/${problem.rule.id}/`,
      raw: problem.raw,
      line: problem.line,
      col: problem.col,
    },
  };
}

/**
 * Get the HTMLHint configuration settings for the given HTML file.  This method will take care of whether to use
 * VS Code settings, or to use a .htmlhintrc file.
 */
function getConfiguration(filePath: string): any {
  let options: any;

  trace(`[HTMLHint Debug] Getting configuration for file: ${filePath}`);
  trace(`[HTMLHint Debug] Current settings: ${JSON.stringify(settings)}`);

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
        trace(
          `[HTMLHint Debug] Using configFile setting: ${settings.htmlhint.configFile}`,
        );
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
      trace(
        `[HTMLHint Debug] Using options setting: ${JSON.stringify(settings.htmlhint.options)}`,
      );
    } else if (settings.htmlhint && settings.htmlhint.optionsFile) {
      if (fs.existsSync(settings.htmlhint.optionsFile)) {
        options = loadConfigurationFile(settings.htmlhint.optionsFile);
        trace(
          `[HTMLHint Debug] Using optionsFile setting: ${settings.htmlhint.optionsFile}`,
        );
      } else {
        trace(
          `[HTMLHint Debug] optionsFile does not exist: ${settings.htmlhint.optionsFile}, falling back to file search`,
        );
        options = findConfigForHtmlFile(filePath);
      }
    } else {
      trace(
        `[HTMLHint Debug] No explicit config specified, searching for .htmlhintrc`,
      );
      options = findConfigForHtmlFile(filePath);
    }
  } else {
    trace(`[HTMLHint Debug] No settings available, searching for .htmlhintrc`);
    options = findConfigForHtmlFile(filePath);
  }

  // Ensure we return an object (empty object if no config found)
  options = options || {};
  trace(`[HTMLHint Debug] Final configuration: ${JSON.stringify(options)}`);
  return options;
}

/**
 * Given the path of an HTML file, this function will look in current directory & parent directories
 * to find a .htmlhintrc file to use as the linter configuration.  The settings are
 */
function findConfigForHtmlFile(base: string) {
  let options: any;
  trace(`[HTMLHint Debug] Looking for config starting from: ${base}`);

  if (fs.existsSync(base)) {
    // find default config file in parent directory
    if (fs.statSync(base).isDirectory() === false) {
      base = path.dirname(base);
      trace(`[HTMLHint Debug] File path detected, using directory: ${base}`);
    }

    while (base && base.length > 0) {
      // Check for both .htmlhintrc and .htmlhintrc.json files
      const configFiles = [
        path.resolve(base, ".htmlhintrc"),
        path.resolve(base, ".htmlhintrc.json"),
      ];

      for (const tmpConfigFile of configFiles) {
        trace(`[HTMLHint Debug] Checking config path: ${tmpConfigFile}`);

        // undefined means we haven't tried to load the config file at this path, so try to load it.
        if (htmlhintrcOptions[tmpConfigFile] === undefined) {
          htmlhintrcOptions[tmpConfigFile] =
            loadConfigurationFile(tmpConfigFile);
        }

        // defined, non-null value means we found a config file at the given path, so use it.
        if (htmlhintrcOptions[tmpConfigFile]) {
          options = htmlhintrcOptions[tmpConfigFile];
          trace(`[HTMLHint Debug] Using config from: ${tmpConfigFile}`);
          return options;
        }
      }

      // Move to parent directory
      let parentBase = path.dirname(base);
      if (parentBase === base) {
        // Reached root directory, stop searching
        break;
      }
      base = parentBase;
    }
  } else {
    trace(`[HTMLHint Debug] Base path does not exist: ${base}`);
  }

  if (!options) {
    trace(`[HTMLHint Debug] No config file found, using default rules`);
  }

  return options;
}

/**
 * Given a path to a .htmlhintrc file, load it into a javascript object and return it.
 */
function loadConfigurationFile(configFile: string): any {
  let ruleset: any = null;
  trace(`[HTMLHint Debug] Attempting to load config file: ${configFile}`);
  if (fs.existsSync(configFile)) {
    trace(`[HTMLHint Debug] Config file exists, reading: ${configFile}`);
    try {
      let config = fs.readFileSync(configFile, "utf8");
      ruleset = JSON.parse(stripJsonComments(config));
      trace(
        `[HTMLHint Debug] Successfully parsed config: ${JSON.stringify(ruleset)}`,
      );
    } catch (e) {
      trace(`[HTMLHint Debug] Failed to parse config file: ${e}`);
      // Return null so the cache doesn't store a broken config
      ruleset = null;
    }
  } else {
    trace(`[HTMLHint Debug] Config file does not exist: ${configFile}`);
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
  trace(
    `[DEBUG] validateAllTextDocuments called for ${documents.length} documents`,
  );

  if (!settings) {
    trace(
      `[DEBUG] Settings not loaded yet, skipping validation of all documents`,
    );
    return;
  }

  let tracker = new ErrorMessageTracker();
  documents.forEach((document) => {
    try {
      trace(`[DEBUG] Revalidating document: ${document.uri}`);
      validateTextDocument(connection, document);
    } catch (err) {
      tracker.add(getErrorMessage(err, document));
    }
  });
  tracker.sendErrors(connection);
  trace(`[DEBUG] validateAllTextDocuments completed`);
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
  // Also log to console for debugging
  connection.console.log(message);
}

/**
 * Create auto-fix action for html-lang-require rule
 */
function createHtmlLangRequireFix(
  document: TextDocument,
  diagnostic: Diagnostic,
): CodeAction | null {
  trace(
    `[DEBUG] createHtmlLangRequireFix called with diagnostic: ${JSON.stringify(diagnostic)}`,
  );

  if (!diagnostic.data || diagnostic.data.ruleId !== "html-lang-require") {
    trace(
      `[DEBUG] createHtmlLangRequireFix: Invalid diagnostic data or ruleId`,
    );
    return null;
  }

  const text = document.getText();
  const htmlTagMatch = text.match(/<html(\s[^>]*)?>/i);

  if (!htmlTagMatch) {
    trace(`[DEBUG] createHtmlLangRequireFix: No html tag found`);
    return null;
  }

  const htmlTagStart = htmlTagMatch.index!;
  const htmlTag = htmlTagMatch[0];
  trace(
    `[DEBUG] createHtmlLangRequireFix: Found html tag at index ${htmlTagStart}: ${htmlTag}`,
  );

  // Check if lang attribute already exists
  const langAttrMatch = htmlTag.match(/\slang\s*=\s*["'][^"']*["']/i);
  if (langAttrMatch) {
    trace(`[DEBUG] createHtmlLangRequireFix: Lang attribute already exists`);
    return null; // Lang attribute already exists
  }

  // Calculate position to insert lang attribute
  const insertPosition = document.positionAt(htmlTagStart + 5); // After "<html"
  const newText = ' lang="en"';
  trace(
    `[DEBUG] createHtmlLangRequireFix: Will insert "${newText}" at position ${JSON.stringify(insertPosition)}`,
  );

  const edit: TextEdit = {
    range: {
      start: insertPosition,
      end: insertPosition,
    },
    newText: newText,
  };

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: [edit],
    },
  };

  trace(`[DEBUG] createHtmlLangRequireFix: Returning fix action`);
  return {
    title: 'Add lang="en" attribute to html tag',
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true,
  };
}

/**
 * Create auto-fix action for title-require rule
 */
function createTitleRequireFix(
  document: TextDocument,
  diagnostic: Diagnostic,
): CodeAction | null {
  if (!diagnostic.data || diagnostic.data.ruleId !== "title-require") {
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
  const headStart = headMatch.index! + headMatch[0].indexOf(">") + 1;
  const metaCharsetMatch = headContent.match(
    /<meta\s+charset\s*=\s*["'][^"']*["'][^>]*>/i,
  );

  let insertPosition: number;
  let newText: string;

  if (metaCharsetMatch) {
    const metaCharsetEnd =
      headStart + metaCharsetMatch.index! + metaCharsetMatch[0].length;
    insertPosition = metaCharsetEnd;
    newText = "\n    <title>Document</title>";
  } else {
    insertPosition = headStart;
    newText = "\n    <title>Document</title>";
  }

  const edit: TextEdit = {
    range: {
      start: document.positionAt(insertPosition),
      end: document.positionAt(insertPosition),
    },
    newText: newText,
  };

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: [edit],
    },
  };

  return {
    title: "Add <title> tag",
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true,
  };
}

/**
 * Create auto-fix action for attr-value-double-quotes rule
 */
function createAttrValueDoubleQuotesFix(
  document: TextDocument,
  diagnostic: Diagnostic,
): CodeAction | null {
  if (
    !diagnostic.data ||
    diagnostic.data.ruleId !== "attr-value-double-quotes" ||
    typeof diagnostic.data.line !== "number" ||
    typeof diagnostic.data.col !== "number"
  ) {
    return null;
  }

  const text = document.getText();
  const lines = text.split("\n");
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
      const lineStartPos = document.positionAt(
        text
          .split("\n")
          .slice(0, diagnostic.data.line - 1)
          .join("\n").length + (diagnostic.data.line > 1 ? 1 : 0),
      );
      const startPos = { line: lineStartPos.line, character: startCol };
      const endPos = { line: lineStartPos.line, character: endCol };

      edits.push({
        range: { start: startPos, end: endPos },
        newText: `${attrName}="${attrValue}"`,
      });
      break;
    }
  }

  if (edits.length === 0) {
    return null;
  }

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: edits,
    },
  };

  return {
    title: "Change attribute quotes to double quotes",
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true,
  };
}

/**
 * Create auto-fix action for tagname-lowercase rule
 */
function createTagnameLowercaseFix(
  document: TextDocument,
  diagnostic: Diagnostic,
): CodeAction | null {
  if (
    !diagnostic.data ||
    diagnostic.data.ruleId !== "tagname-lowercase" ||
    typeof diagnostic.data.line !== "number" ||
    typeof diagnostic.data.col !== "number"
  ) {
    return null;
  }

  const text = document.getText();
  const lines = text.split("\n");
  const line = lines[diagnostic.data.line - 1];

  if (!line) {
    return null;
  }

  // Find uppercase tag names and convert to lowercase
  const tagPattern = /<\/?([A-Z][A-Za-z0-9]*)\b/g;
  let match;
  const edits: TextEdit[] = [];

  while ((match = tagPattern.exec(line)) !== null) {
    const startCol = match.index + 1 + (match[0].startsWith("</") ? 1 : 0); // Position after < or </
    const endCol = startCol + match[1].length;
    const tagName = match[1];

    // Check if this match is at or near the diagnostic position
    const diagnosticCol = diagnostic.data.col - 1;
    if (Math.abs(match.index - diagnosticCol) <= 5) {
      const lineStartPos = document.positionAt(
        text
          .split("\n")
          .slice(0, diagnostic.data.line - 1)
          .join("\n").length + (diagnostic.data.line > 1 ? 1 : 0),
      );
      const startPos = { line: lineStartPos.line, character: startCol };
      const endPos = { line: lineStartPos.line, character: endCol };

      edits.push({
        range: { start: startPos, end: endPos },
        newText: tagName.toLowerCase(),
      });
      break;
    }
  }

  if (edits.length === 0) {
    return null;
  }

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: edits,
    },
  };

  return {
    title: "Convert tag to lowercase",
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true,
  };
}

/**
 * Create auto-fix action for attr-lowercase rule
 */
function createAttrLowercaseFix(
  document: TextDocument,
  diagnostic: Diagnostic,
): CodeAction | null {
  if (
    !diagnostic.data ||
    diagnostic.data.ruleId !== "attr-lowercase" ||
    typeof diagnostic.data.line !== "number" ||
    typeof diagnostic.data.col !== "number"
  ) {
    return null;
  }

  const text = document.getText();
  const lines = text.split("\n");
  const line = lines[diagnostic.data.line - 1];

  if (!line) {
    return null;
  }

  // Find uppercase attribute names and convert to lowercase
  const attrPattern = /\s([A-Z][A-Za-z0-9-_]*)\s*=/g;
  let match;
  const edits: TextEdit[] = [];

  while ((match = attrPattern.exec(line)) !== null) {
    const startCol = match.index + 1; // Position after the space
    const endCol = startCol + match[1].length;
    const attrName = match[1];

    // Check if this match is at or near the diagnostic position
    const diagnosticCol = diagnostic.data.col - 1;
    if (Math.abs(startCol - diagnosticCol) <= 5) {
      const lineStartPos = document.positionAt(
        text
          .split("\n")
          .slice(0, diagnostic.data.line - 1)
          .join("\n").length + (diagnostic.data.line > 1 ? 1 : 0),
      );
      const startPos = { line: lineStartPos.line, character: startCol };
      const endPos = { line: lineStartPos.line, character: endCol };

      edits.push({
        range: { start: startPos, end: endPos },
        newText: attrName.toLowerCase(),
      });
      break;
    }
  }

  if (edits.length === 0) {
    return null;
  }

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: edits,
    },
  };

  return {
    title: "Convert attribute to lowercase",
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true,
  };
}

/**
 * Create auto-fix action for doctype-first rule
 */
function createDoctypeFirstFix(
  document: TextDocument,
  diagnostic: Diagnostic,
): CodeAction | null {
  if (!diagnostic.data || diagnostic.data.ruleId !== "doctype-first") {
    return null;
  }

  const text = document.getText();

  // Check if DOCTYPE already exists (shouldn't if this rule triggered, but let's be safe)
  if (text.toLowerCase().includes("<!doctype")) {
    return null;
  }

  // Insert DOCTYPE at the beginning of the document
  const insertPosition = document.positionAt(0);
  const newText = "<!DOCTYPE html>\n";

  const edit: TextEdit = {
    range: {
      start: insertPosition,
      end: insertPosition,
    },
    newText: newText,
  };

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: [edit],
    },
  };

  return {
    title: "Add DOCTYPE html declaration",
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true,
  };
}

/**
 * Create auto-fix action for doctype-html5 rule
 */
function createDoctypeHtml5Fix(
  document: TextDocument,
  diagnostic: Diagnostic,
): CodeAction | null {
  if (!diagnostic.data || diagnostic.data.ruleId !== "doctype-html5") {
    return null;
  }

  const text = document.getText();

  // Find the existing DOCTYPE declaration
  const doctypeMatch = text.match(/<!DOCTYPE[^>]*>/i);
  if (!doctypeMatch) {
    return null;
  }

  const doctypeStart = doctypeMatch.index!;
  const doctypeEnd = doctypeStart + doctypeMatch[0].length;

  const edit: TextEdit = {
    range: {
      start: document.positionAt(doctypeStart),
      end: document.positionAt(doctypeEnd),
    },
    newText: "<!DOCTYPE html>",
  };

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: [edit],
    },
  };

  return {
    title: "Convert to HTML5 DOCTYPE",
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true,
  };
}

/**
 * Create auto-fix action for meta-charset-require rule
 */
function createMetaCharsetRequireFix(
  document: TextDocument,
  diagnostic: Diagnostic,
): CodeAction | null {
  if (!diagnostic.data || diagnostic.data.ruleId !== "meta-charset-require") {
    return null;
  }

  const text = document.getText();
  const headMatch = text.match(/<head(\s[^>]*)?>([\s\S]*?)<\/head>/i);

  if (!headMatch) {
    return null;
  }

  const headContent = headMatch[2];
  const charsetMatch = headContent.match(
    /<meta\s+charset\s*=\s*["'][^"']*["'][^>]*>/i,
  );

  if (charsetMatch) {
    return null; // Charset meta tag already exists
  }

  // Insert charset meta tag at the beginning of head (right after <head>)
  const headStart = headMatch.index! + headMatch[0].indexOf(">") + 1;
  const insertPosition = headStart;
  const newText = '\n    <meta charset="UTF-8">';

  const edit: TextEdit = {
    range: {
      start: document.positionAt(insertPosition),
      end: document.positionAt(insertPosition),
    },
    newText: newText,
  };

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: [edit],
    },
  };

  return {
    title: 'Add <meta charset="UTF-8"> tag',
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true,
  };
}

/**
 * Create auto-fix action for meta-viewport-require rule
 */
function createMetaViewportRequireFix(
  document: TextDocument,
  diagnostic: Diagnostic,
): CodeAction | null {
  if (!diagnostic.data || diagnostic.data.ruleId !== "meta-viewport-require") {
    return null;
  }

  const text = document.getText();
  const headMatch = text.match(/<head(\s[^>]*)?>([\s\S]*?)<\/head>/i);

  if (!headMatch) {
    return null;
  }

  const headContent = headMatch[2];
  const viewportMatch = headContent.match(
    /<meta\s+name\s*=\s*["']viewport["'][^>]*>/i,
  );

  if (viewportMatch) {
    return null; // Viewport meta tag already exists
  }

  // Find a good position to insert viewport meta tag (after meta charset if it exists, otherwise at the beginning of head)
  const headStart = headMatch.index! + headMatch[0].indexOf(">") + 1;
  const metaCharsetMatch = headContent.match(
    /<meta\s+charset\s*=\s*["'][^"']*["'][^>]*>/i,
  );

  let insertPosition: number;
  let newText: string;

  if (metaCharsetMatch) {
    const metaCharsetEnd =
      headStart + metaCharsetMatch.index! + metaCharsetMatch[0].length;
    insertPosition = metaCharsetEnd;
    newText =
      '\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">';
  } else {
    insertPosition = headStart;
    newText =
      '\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">';
  }

  const edit: TextEdit = {
    range: {
      start: document.positionAt(insertPosition),
      end: document.positionAt(insertPosition),
    },
    newText: newText,
  };

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: [edit],
    },
  };

  return {
    title: 'Add <meta name="viewport"> tag',
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true,
  };
}

/**
 * Create auto-fix action for meta-description-require rule
 */
function createMetaDescriptionRequireFix(
  document: TextDocument,
  diagnostic: Diagnostic,
): CodeAction | null {
  if (
    !diagnostic.data ||
    diagnostic.data.ruleId !== "meta-description-require"
  ) {
    return null;
  }

  const text = document.getText();
  const headMatch = text.match(/<head(\s[^>]*)?>([\s\S]*?)<\/head>/i);

  if (!headMatch) {
    return null;
  }

  const headContent = headMatch[2];
  const descriptionMatch = headContent.match(
    /<meta\s+name\s*=\s*["']description["'][^>]*>/i,
  );

  if (descriptionMatch) {
    return null; // Description meta tag already exists
  }

  // Find a good position to insert description meta tag (after charset and viewport if they exist, otherwise at the beginning of head)
  const headStart = headMatch.index! + headMatch[0].indexOf(">") + 1;
  const metaCharsetMatch = headContent.match(
    /<meta\s+charset\s*=\s*["'][^"']*["'][^>]*>/i,
  );
  const metaViewportMatch = headContent.match(
    /<meta\s+name\s*=\s*["']viewport["'][^>]*>/i,
  );

  let insertPosition: number;
  let newText: string;

  if (metaViewportMatch) {
    // Insert after viewport meta tag
    const metaViewportEnd =
      headStart + metaViewportMatch.index! + metaViewportMatch[0].length;
    insertPosition = metaViewportEnd;
    newText = '\n    <meta name="description" content="">';
  } else if (metaCharsetMatch) {
    // Insert after charset meta tag
    const metaCharsetEnd =
      headStart + metaCharsetMatch.index! + metaCharsetMatch[0].length;
    insertPosition = metaCharsetEnd;
    newText = '\n    <meta name="description" content="">';
  } else {
    // Insert at the beginning of head
    insertPosition = headStart;
    newText = '\n    <meta name="description" content="">';
  }

  const edit: TextEdit = {
    range: {
      start: document.positionAt(insertPosition),
      end: document.positionAt(insertPosition),
    },
    newText: newText,
  };

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: [edit],
    },
  };

  return {
    title: 'Add <meta name="description"> tag',
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true,
  };
}

/**
 * Create auto-fix action for alt-require rule
 */
function createAltRequireFix(
  document: TextDocument,
  diagnostic: Diagnostic,
): CodeAction | null {
  if (!diagnostic.data || diagnostic.data.ruleId !== "alt-require") {
    trace(`[DEBUG] createAltRequireFix: Invalid diagnostic data or ruleId`);
    return null;
  }

  const text = document.getText();
  const lines = text.split("\n");
  const line = lines[diagnostic.data.line - 1];

  if (!line) {
    trace(
      `[DEBUG] createAltRequireFix: No line found at ${diagnostic.data.line}`,
    );
    return null;
  }

  // Find img, area[href], or input[type=image] tags missing alt attribute
  const imgPattern = /<(img|area|input)((?:\s+[^>]*?)?)\s*(\/?)>/gi;
  let match;
  const edits: TextEdit[] = [];

  while ((match = imgPattern.exec(line)) !== null) {
    const startCol = match.index;
    const endCol = startCol + match[0].length;
    const tagName = match[1].toLowerCase();
    const attributes = match[2] || "";
    const selfClosing = match[3] || "";

    // Check if this match is at or near the diagnostic position
    const diagnosticCol = diagnostic.data.col - 1;
    if (Math.abs(startCol - diagnosticCol) <= 30) {
      // Check if alt attribute already exists
      if (attributes.toLowerCase().includes("alt=")) {
        break;
      }

      // For area tags, only add alt if href is present
      if (tagName === "area" && !attributes.toLowerCase().includes("href=")) {
        break;
      }

      // For input tags, only add alt if type="image"
      if (tagName === "input") {
        const typeMatch = attributes.match(/type\s*=\s*["']([^"']*)["']/i);
        if (!typeMatch || typeMatch[1].toLowerCase() !== "image") {
          break;
        }
      }

      const startPos = {
        line: diagnostic.data.line - 1,
        character: startCol,
      };
      const endPos = { line: diagnostic.data.line - 1, character: endCol };

      // Add alt attribute properly
      let newText: string;
      if (selfClosing === "/") {
        // Self-closing tag like <img src="test.jpg" />
        newText = `<${tagName}${attributes} alt="" />`;
      } else {
        // Regular tag like <img src="test.jpg">
        newText = `<${tagName}${attributes} alt="">`;
      }

      edits.push({
        range: { start: startPos, end: endPos },
        newText: newText,
      });
      break;
    }
  }

  if (edits.length === 0) {
    trace(`[DEBUG] createAltRequireFix: No edits created`);
    return null;
  }

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: edits,
    },
  };

  return {
    title: "Add alt attribute",
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true,
  };
}

/**
 * Create auto-fix action for button-type-require rule
 */
function createButtonTypeRequireFix(
  document: TextDocument,
  diagnostic: Diagnostic,
): CodeAction | null {
  if (!diagnostic.data || diagnostic.data.ruleId !== "button-type-require") {
    trace(
      `[DEBUG] createButtonTypeRequireFix: Invalid diagnostic data or ruleId`,
    );
    return null;
  }

  const text = document.getText();
  const lines = text.split("\n");
  const line = lines[diagnostic.data.line - 1];

  if (!line) {
    trace(
      `[DEBUG] createButtonTypeRequireFix: No line found at ${diagnostic.data.line}`,
    );
    return null;
  }

  // Find button tags missing type attribute
  const buttonPattern = /<button(\s[^>]*)?>/gi;
  let match;
  const edits: TextEdit[] = [];

  while ((match = buttonPattern.exec(line)) !== null) {
    const startCol = match.index;
    const endCol = startCol + match[0].length;
    const attributes = match[1] || "";

    // Check if this match is at or near the diagnostic position
    const diagnosticCol = diagnostic.data.col - 1;
    if (Math.abs(startCol - diagnosticCol) <= 15) {
      // Check if type attribute already exists
      if (attributes.toLowerCase().includes("type=")) {
        break;
      }

      const startPos = {
        line: diagnostic.data.line - 1,
        character: startCol,
      };
      const endPos = { line: diagnostic.data.line - 1, character: endCol };

      // Add type="button" attribute
      const newText = `<button${attributes} type="button">`;

      edits.push({
        range: { start: startPos, end: endPos },
        newText: newText,
      });
      break;
    }
  }

  if (edits.length === 0) {
    trace(`[DEBUG] createButtonTypeRequireFix: No edits created`);
    return null;
  }

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: edits,
    },
  };

  return {
    title: 'Add type="button" attribute',
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true,
  };
}

/**
 * Create auto-fix action for attr-no-unnecessary-whitespace rule
 */
function createAttrNoUnnecessaryWhitespaceFix(
  document: TextDocument,
  diagnostic: Diagnostic,
): CodeAction | null {
  if (
    !diagnostic.data ||
    diagnostic.data.ruleId !== "attr-no-unnecessary-whitespace"
  ) {
    trace(
      `[DEBUG] createAttrNoUnnecessaryWhitespaceFix: Invalid diagnostic data or ruleId`,
    );
    return null;
  }

  const text = document.getText();
  const lines = text.split("\n");
  const line = lines[diagnostic.data.line - 1];

  if (!line) {
    trace(
      `[DEBUG] createAttrNoUnnecessaryWhitespaceFix: No line found at ${diagnostic.data.line}`,
    );
    return null;
  }

  // Find attributes with unnecessary whitespace around the = sign
  const attrPattern = /(\w+)\s*=\s*("([^"]*)"|'([^']*)')/g;
  let match;
  const edits: TextEdit[] = [];

  while ((match = attrPattern.exec(line)) !== null) {
    const startCol = match.index;
    const endCol = startCol + match[0].length;
    const attrName = match[1];
    const attrValue = match[2];

    // Check if this match is at or near the diagnostic position
    const diagnosticCol = diagnostic.data.col - 1;
    if (Math.abs(startCol - diagnosticCol) <= 10) {
      // Check if there's unnecessary whitespace
      if (match[0] !== `${attrName}=${attrValue}`) {
        const startPos = {
          line: diagnostic.data.line - 1,
          character: startCol,
        };
        const endPos = { line: diagnostic.data.line - 1, character: endCol };

        edits.push({
          range: { start: startPos, end: endPos },
          newText: `${attrName}=${attrValue}`,
        });
        break;
      }
    }
  }

  if (edits.length === 0) {
    trace(`[DEBUG] createAttrNoUnnecessaryWhitespaceFix: No edits created`);
    return null;
  }

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: edits,
    },
  };

  return {
    title: "Remove unnecessary whitespace around attribute",
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true,
  };
}

/**
 * Create auto-fix actions for supported rules
 */
async function createAutoFixes(
  document: TextDocument,
  diagnostics: Diagnostic[],
): Promise<CodeAction[]> {
  trace(
    `[DEBUG] createAutoFixes called with ${diagnostics.length} diagnostics`,
  );
  const actions: CodeAction[] = [];

  for (const diagnostic of diagnostics) {
    trace(`[DEBUG] Processing diagnostic: ${JSON.stringify(diagnostic)}`);
    const ruleId = diagnostic.data?.ruleId || diagnostic.code;
    trace(`[DEBUG] Using ruleId: ${ruleId}`);

    if (!ruleId) {
      trace(`[DEBUG] Skipping diagnostic without ruleId`);
      continue;
    }

    try {
      let fix: CodeAction | null = null;

      switch (ruleId) {
        case "html-lang-require":
          trace(`[DEBUG] Calling createHtmlLangRequireFix`);
          fix = await createHtmlLangRequireFix(document, diagnostic);
          break;
        case "title-require":
          trace(`[DEBUG] Calling createTitleRequireFix`);
          fix = await createTitleRequireFix(document, diagnostic);
          break;
        case "attr-value-double-quotes":
          trace(`[DEBUG] Calling createAttrValueDoubleQuotesFix`);
          fix = await createAttrValueDoubleQuotesFix(document, diagnostic);
          break;
        case "tagname-lowercase":
          trace(`[DEBUG] Calling createTagnameLowercaseFix`);
          fix = await createTagnameLowercaseFix(document, diagnostic);
          break;
        case "attr-lowercase":
          trace(`[DEBUG] Calling createAttrLowercaseFix`);
          fix = await createAttrLowercaseFix(document, diagnostic);
          break;
        case "doctype-first":
          trace(`[DEBUG] Calling createDoctypeFirstFix`);
          fix = await createDoctypeFirstFix(document, diagnostic);
          break;
        case "doctype-html5":
          trace(`[DEBUG] Calling createDoctypeHtml5Fix`);
          fix = await createDoctypeHtml5Fix(document, diagnostic);
          break;
        case "meta-charset-require":
          trace(`[DEBUG] Calling createMetaCharsetRequireFix`);
          fix = await createMetaCharsetRequireFix(document, diagnostic);
          break;
        case "meta-viewport-require":
          trace(`[DEBUG] Calling createMetaViewportRequireFix`);
          fix = await createMetaViewportRequireFix(document, diagnostic);
          break;
        case "meta-description-require":
          trace(`[DEBUG] Calling createMetaDescriptionRequireFix`);
          fix = await createMetaDescriptionRequireFix(document, diagnostic);
          break;
        case "alt-require":
          trace(`[DEBUG] Calling createAltRequireFix`);
          fix = createAltRequireFix(document, diagnostic);
          break;
        case "button-type-require":
          trace(`[DEBUG] Calling createButtonTypeRequireFix`);
          fix = createButtonTypeRequireFix(document, diagnostic);
          break;
        case "attr-no-unnecessary-whitespace":
          trace(`[DEBUG] Calling createAttrNoUnnecessaryWhitespaceFix`);
          fix = createAttrNoUnnecessaryWhitespaceFix(document, diagnostic);
          break;
        default:
          trace(`[DEBUG] No autofix function found for rule: ${ruleId}`);
          break;
      }

      if (fix) {
        trace(`[DEBUG] Adding fix for rule ${ruleId}`);
        actions.push(fix);
      } else {
        trace(`[DEBUG] No fix created for rule ${ruleId}`);
      }
    } catch (error) {
      trace(`[DEBUG] Error in autofix for rule ${ruleId}: ${error}`);
    }
  }

  trace(`[DEBUG] Returning ${actions.length} auto-fix actions`);
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
          codeActionKinds: [CodeActionKind.QuickFix],
        },
        workspace: {
          workspaceFolders: {
            supported: true,
          },
        },
      },
    };
    return result;
  },
);

// Set up file watchers and request initial configuration after initialization
connection.onInitialized(() => {
  trace("[DEBUG] Server initialized, requesting initial configuration");

  // Request initial configuration
  connection.workspace
    .getConfiguration("htmlhint")
    .then((config) => {
      trace("[DEBUG] Initial configuration loaded");
      settings = { htmlhint: config };

      // Only validate documents after configuration is loaded
      validateAllTextDocuments(connection, documents.all());
    })
    .catch((error) => {
      trace("[DEBUG] Failed to load initial configuration: " + error);
      // Set default settings and validate with default configuration
      settings = {
        htmlhint: {
          enable: true,
          options: {},
          configFile: "",
          optionsFile: "",
        },
      };
      validateAllTextDocuments(connection, documents.all());
    });
});

function doValidate(connection: Connection, document: TextDocument): void {
  try {
    // Check if configuration has been loaded yet
    if (!settings) {
      trace("[DEBUG] Configuration not yet loaded, skipping validation");
      return;
    }

    let uri = document.uri;
    // Convert URI to file path using vscode-uri
    let fsPath = URI.parse(uri).fsPath;

    trace(`[DEBUG] doValidate called for: ${fsPath}`);

    let contents = document.getText();
    let lines = contents.split("\n");

    let config = getConfiguration(fsPath);
    trace(`[DEBUG] Loaded config: ${JSON.stringify(config)}`);

    let errors: htmlhint.Error[] = linter.verify(contents, config);
    trace(`[DEBUG] HTMLHint found ${errors.length} errors`);

    let diagnostics: Diagnostic[] = [];
    if (errors.length > 0) {
      errors.forEach((each) => {
        trace(`[DEBUG] Error found: ${each.rule.id} - ${each.message}`);
        diagnostics.push(makeDiagnostic(each, document));
      });
    }

    trace(`[DEBUG] Sending ${diagnostics.length} diagnostics to VS Code`);
    connection.sendDiagnostics({ uri, diagnostics });
  } catch (err) {
    trace(`[DEBUG] doValidate error: ${err}`);
    if (isErrorWithMessage(err)) {
      throw new Error(err.message);
    }
    throw err;
  }
}

// A text document has changed. Validate the document.
documents.onDidChangeContent((event) => {
  // the contents of a text document has changed
  trace(`[DEBUG] Document content changed: ${event.document.uri}`);
  validateTextDocument(connection, event.document);
});

// A text document has been opened. Validate the document.
documents.onDidOpen((event) => {
  trace(`[DEBUG] Document opened: ${event.document.uri}`);
  validateTextDocument(connection, event.document);
});

// Send an empty array of diagnostics to stop displaying them on a closed file
connection.onDidCloseTextDocument((event) => {
  const uri = event.textDocument.uri;
  trace(`[DEBUG] Document closed: ${uri}`);
  connection.sendDiagnostics({ uri, diagnostics: [] });
});

// The VS Code htmlhint settings have changed. Revalidate all documents.
connection.onDidChangeConfiguration((params) => {
  trace(`[DEBUG] Configuration changed`);

  // Request the updated configuration from the client
  connection.workspace
    .getConfiguration("htmlhint")
    .then((config) => {
      trace(`[DEBUG] Updated configuration loaded: ${JSON.stringify(config)}`);
      settings = { htmlhint: config };

      // Clear all cached config files when settings change
      Object.keys(htmlhintrcOptions).forEach((configPath) => {
        htmlhintrcOptions[configPath] = undefined;
      });

      trace(`[DEBUG] Triggering revalidation due to settings change`);
      validateAllTextDocuments(connection, documents.all());
    })
    .catch((error) => {
      trace(`[DEBUG] Failed to load updated configuration: ${error}`);
      // Fall back to params.settings if available
      if (params.settings) {
        settings = params.settings;
        Object.keys(htmlhintrcOptions).forEach((configPath) => {
          htmlhintrcOptions[configPath] = undefined;
        });
        validateAllTextDocuments(connection, documents.all());
      }
    });
});

// The watched .htmlhintrc has changed. Clear out the last loaded config, and revalidate all documents.
connection.onDidChangeWatchedFiles((params) => {
  trace(`[DEBUG] File watcher triggered with ${params.changes.length} changes`);

  let shouldRevalidate = false;

  for (let i = 0; i < params.changes.length; i++) {
    // Convert URI to file path using vscode-uri
    let uri = params.changes[i].uri;
    let fsPath = URI.parse(uri).fsPath;

    trace(`[DEBUG] Processing config file change: ${fsPath}`);
    trace(`[DEBUG] Change type: ${params.changes[i].type}`);

    // Only process .htmlhintrc files
    if (fsPath.endsWith(".htmlhintrc") || fsPath.endsWith(".htmlhintrc.json")) {
      shouldRevalidate = true;

      // Clear the specific config file from cache
      htmlhintrcOptions[fsPath] = undefined;

      // Also clear all related configs in parent directories to ensure proper reload
      const dir = path.dirname(fsPath);
      Object.keys(htmlhintrcOptions).forEach((configPath) => {
        if (configPath.startsWith(dir)) {
          trace(`[DEBUG] Clearing cached config: ${configPath}`);
          htmlhintrcOptions[configPath] = undefined;
        }
      });

      // Clear all cached configs to be safe
      trace(`[DEBUG] Clearing all cached configs for safety`);
      Object.keys(htmlhintrcOptions).forEach((configPath) => {
        htmlhintrcOptions[configPath] = undefined;
      });
    }
  }

  if (shouldRevalidate) {
    trace(`[DEBUG] Triggering revalidation of all documents`);
    // Force revalidation of all documents
    validateAllTextDocuments(connection, documents.all());
  } else {
    trace(`[DEBUG] No .htmlhintrc files changed, skipping revalidation`);
  }
});

interface LSPCodeAction {
  title: string;
  kind?: string;
  diagnostics?: Diagnostic[];
  isPreferred?: boolean;
  edit?: {
    changes: {
      [uri: string]: {
        range: {
          start: { line: number; character: number };
          end: { line: number; character: number };
        };
        newText: string;
      }[];
    };
  };
}

// Handle code action requests for auto-fixes
connection.onRequest(
  "textDocument/codeAction",
  async (params: CodeActionParams): Promise<LSPCodeAction[]> => {
    const { textDocument, range, context } = params;
    const uri = textDocument.uri;
    const document = documents.get(uri);

    if (!document) {
      trace(`[DEBUG] No document found for uri: ${uri}`);
      return [];
    }

    try {
      trace(`[DEBUG] Code action requested for ${uri}`);
      trace(`[DEBUG] Range: ${JSON.stringify(range)}`);
      trace(
        `[DEBUG] Context diagnostics: ${JSON.stringify(context.diagnostics)}`,
      );

      // Filter diagnostics to only include those that intersect with the range
      const filteredDiagnostics = context.diagnostics.filter((diagnostic) => {
        const diagnosticRange = diagnostic.range;
        return (
          diagnosticRange.start.line <= range.end.line &&
          diagnosticRange.end.line >= range.start.line
        );
      });

      trace(
        `[DEBUG] Filtered diagnostics: ${JSON.stringify(filteredDiagnostics)}`,
      );

      if (filteredDiagnostics.length === 0) {
        trace(`[DEBUG] No diagnostics intersect with the range`);
        return [];
      }

      // Create auto-fixes for each diagnostic
      const codeActions: LSPCodeAction[] = [];
      for (const diagnostic of filteredDiagnostics) {
        trace(
          `[DEBUG] Creating fixes for diagnostic: ${JSON.stringify(diagnostic)}`,
        );
        trace(`[DEBUG] Diagnostic data: ${JSON.stringify(diagnostic.data)}`);
        trace(`[DEBUG] Diagnostic code: ${JSON.stringify(diagnostic.code)}`);

        // Ensure diagnostic has the required data
        const enhancedDiagnostic = {
          ...diagnostic,
          data: diagnostic.data || {
            ruleId: diagnostic.code,
            href: diagnostic.codeDescription?.href,
            line: diagnostic.range.start.line + 1,
            col: diagnostic.range.start.character + 1,
            raw: diagnostic.message.split(" ")[0],
          },
        };

        const fixes = await createAutoFixes(document, [enhancedDiagnostic]);
        trace(
          `[DEBUG] Created ${fixes.length} fixes for diagnostic: ${JSON.stringify(enhancedDiagnostic)}`,
        );
        codeActions.push(
          ...fixes.map((fix) => ({
            title: fix.title,
            kind: fix.kind,
            diagnostics: fix.diagnostics,
            isPreferred: fix.isPreferred,
            edit: fix.edit
              ? {
                  changes: {
                    [uri]: fix.edit.changes[uri].map((change) => ({
                      range: {
                        start: {
                          line: change.range.start.line,
                          character: change.range.start.character,
                        },
                        end: {
                          line: change.range.end.line,
                          character: change.range.end.character,
                        },
                      },
                      newText: change.newText,
                    })),
                  },
                }
              : undefined,
          })),
        );
      }

      trace(`[DEBUG] Created ${codeActions.length} auto-fix actions`);
      trace(`[DEBUG] Code actions: ${JSON.stringify(codeActions)}`);

      return codeActions;
    } catch (error) {
      trace(`Error creating code actions: ${error}`);
      return [];
    }
  },
);

connection.listen();
