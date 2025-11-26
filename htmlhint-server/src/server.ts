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
import * as fs from "fs";
import {
  createConnection,
  TextDocuments,
  Diagnostic,
  DiagnosticSeverity,
  InitializeParams,
  TextDocumentSyncKind,
  InitializeResult,
  Connection,
  CancellationToken,
  CodeActionParams,
  CodeAction,
  CodeActionKind,
  TextEdit,
  WorkspaceEdit,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import * as htmlhint from "htmlhint";
import { URI } from "vscode-uri";
import ignore from "ignore";
import stripJsonComments from "strip-json-comments";

// Cache for gitignore patterns to avoid repeatedly parsing .gitignore files
let gitignoreCache: Map<string, ReturnType<typeof ignore>> = new Map();

// Cache for workspace root detection to avoid repeated filesystem calls
let workspaceRootCache: Map<string, string | null> = new Map();

interface HtmlHintSettings {
  configFile: string;
  enable: boolean;
  options: Record<string, unknown>;
  optionsFile: string;
  ignoreGitignore: boolean;
}

interface Settings {
  htmlhint: HtmlHintSettings;
  [key: string]: unknown;
}

interface HtmlHintConfig {
  [key: string]: unknown;
}

let settings: Settings | null = null;
let linter: {
  verify: (text: string, config?: HtmlHintConfig) => htmlhint.Error[];
} | null = null;

/**
 * This variable is used to cache loaded htmlhintrc objects.  It is a dictionary from path -> config object.
 * A value of null means a .htmlhintrc object didn't exist at the given path.
 * A value of undefined means the file at this path hasn't been loaded yet, or should be reloaded because it changed
 */
let htmlhintrcOptions: Record<string, HtmlHintConfig | null | undefined> = {};

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
function getConfiguration(filePath: string): HtmlHintConfig {
  let options: HtmlHintConfig | undefined;

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
function findConfigForHtmlFile(base: string): HtmlHintConfig | undefined {
  let options: HtmlHintConfig | undefined;
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
function loadConfigurationFile(configFile: string): HtmlHintConfig | null {
  let ruleset: HtmlHintConfig | null = null;
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

  // Collect all errors and send them together instead of using ErrorMessageTracker
  const errors: string[] = [];
  documents.forEach((document) => {
    try {
      trace(`[DEBUG] Revalidating document: ${document.uri}`);
      validateTextDocument(connection, document);
    } catch (err) {
      errors.push(getErrorMessage(err, document));
    }
  });

  // Send all errors at once if there are any
  if (errors.length > 0) {
    connection.window.showErrorMessage(errors.join("\n"));
  }

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

let connection: Connection = createConnection();
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
      const lineIndex = diagnostic.data.line - 1;
      const startPos = { line: lineIndex, character: startCol };
      const endPos = { line: lineIndex, character: endCol };

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
      const lineIndex = diagnostic.data.line - 1;
      const startPos = { line: lineIndex, character: startCol };
      const endPos = { line: lineIndex, character: endCol };

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
      const lineIndex = diagnostic.data.line - 1;
      const startPos = { line: lineIndex, character: startCol };
      const endPos = { line: lineIndex, character: endCol };

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
 * Create auto-fix action for attr-whitespace rule
 *
 * This fixes attribute values that have leading or trailing whitespace.
 * The fix removes leading and trailing spaces from attribute values.
 *
 * Example:
 * - Before: <div title=" a "></div>
 * - After:  <div title="a"></div>
 */
function createAttrWhitespaceFix(
  document: TextDocument,
  diagnostic: Diagnostic,
): CodeAction | null {
  trace(
    `[DEBUG] createAttrWhitespaceFix called with diagnostic: ${JSON.stringify(diagnostic)}`,
  );

  if (
    !diagnostic.data ||
    diagnostic.data.ruleId !== "attr-whitespace" ||
    typeof diagnostic.data.line !== "number" ||
    typeof diagnostic.data.col !== "number"
  ) {
    trace(`[DEBUG] createAttrWhitespaceFix: Invalid diagnostic data or ruleId`);
    return null;
  }

  const text = document.getText();
  const lines = text.split("\n");
  const line = lines[diagnostic.data.line - 1];

  if (!line) {
    trace(
      `[DEBUG] createAttrWhitespaceFix: No line found at ${diagnostic.data.line}`,
    );
    return null;
  }

  // Find attributes with leading or trailing whitespace in their values
  // This pattern matches: attrName=" value " or attrName=' value '
  const attrPattern = /([a-zA-Z0-9-_]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
  let match;
  const edits: TextEdit[] = [];

  while ((match = attrPattern.exec(line)) !== null) {
    const startCol = match.index;
    const endCol = startCol + match[0].length;
    const attrName = match[1];
    const quoteType = match[2].startsWith('"') ? '"' : "'";
    const attrValue = match[3] || match[4]; // match[3] for double quotes, match[4] for single quotes

    // Check if this match is at or near the diagnostic position
    const diagnosticCol = diagnostic.data.col - 1;
    if (Math.abs(startCol - diagnosticCol) <= 10) {
      // Check if there's leading or trailing whitespace
      const trimmedValue = attrValue.trim();
      if (trimmedValue !== attrValue) {
        const startPos = {
          line: diagnostic.data.line - 1,
          character: startCol,
        };
        const endPos = { line: diagnostic.data.line - 1, character: endCol };

        edits.push({
          range: { start: startPos, end: endPos },
          newText: `${attrName}=${quoteType}${trimmedValue}${quoteType}`,
        });
        break; // Only fix the first occurrence near the diagnostic
      }
    }
  }

  if (edits.length === 0) {
    trace(`[DEBUG] createAttrWhitespaceFix: No edits created`);
    return null;
  }

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: edits,
    },
  };

  return {
    title: "Remove leading/trailing whitespace from attribute value",
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true,
  };
}

/**
 * Create auto-fix action for tag-self-close rule
 *
 * This fixes void HTML elements (like img, br, hr, input, etc.) that don't properly self-close.
 * The fix converts tags ending with ">" to end with " />" to comply with self-closing tag standards.
 *
 * Example:
 * - Before: <img src="image.jpg">
 * - After:  <img src="image.jpg" />
 */
function createTagSelfCloseFix(
  document: TextDocument,
  diagnostic: Diagnostic,
): CodeAction | null {
  trace(
    `[DEBUG] createTagSelfCloseFix called with diagnostic: ${JSON.stringify(diagnostic)}`,
  );

  if (!diagnostic.data || diagnostic.data.ruleId !== "tag-self-close") {
    trace(
      `[DEBUG] createTagSelfCloseFix: Invalid diagnostic data or ruleId: ${JSON.stringify(diagnostic.data)}`,
    );
    return null;
  }

  trace(
    `[DEBUG] createTagSelfCloseFix: Valid diagnostic for tag-self-close rule`,
  );
  trace(`[DEBUG] Diagnostic range: ${JSON.stringify(diagnostic.range)}`);
  trace(`[DEBUG] Diagnostic data: ${JSON.stringify(diagnostic.data)}`);

  const text = document.getText();
  const range = diagnostic.range;
  const raw = diagnostic.data.raw; // Extract the tag with its attributes from the raw data
  if (!raw) {
    trace(`[DEBUG] createTagSelfCloseFix: No raw data found in diagnostic`);
    return null;
  }

  trace(`[DEBUG] createTagSelfCloseFix: Raw data: ${raw}`);

  // Get the position of the tag's closing '>'
  const lineStart = document.offsetAt({ line: range.start.line, character: 0 });
  const position = document.offsetAt(range.start);
  const lineContent = text.substring(
    lineStart,
    text.indexOf("\n", position) !== -1
      ? text.indexOf("\n", position)
      : text.length,
  );

  trace(`[DEBUG] createTagSelfCloseFix: Line content: ${lineContent}`);

  // Find the last character of the tag
  let tagEndIndex;

  // If raw data contains the complete tag
  if (raw.endsWith(">")) {
    tagEndIndex = document.offsetAt(range.start) + raw.length - 1;
  } else {
    // Try to find the closest '>' after the diagnostic position
    const tagStart = document.offsetAt(range.start);
    const lineText = text.substring(
      tagStart,
      text.indexOf("\n", tagStart) !== -1
        ? text.indexOf("\n", tagStart)
        : text.length,
    );
    const closeTagIndex = lineText.indexOf(">");

    if (closeTagIndex !== -1) {
      tagEndIndex = tagStart + closeTagIndex;
    } else {
      trace(
        `[DEBUG] createTagSelfCloseFix: Could not find closing '>' for tag`,
      );
      return null;
    }
  }

  if (text[tagEndIndex] !== ">") {
    trace(
      `[DEBUG] createTagSelfCloseFix: Unexpected tag ending: ${text[tagEndIndex]} at position ${tagEndIndex}`,
    );
    trace(
      `[DEBUG] Text around position: ${text.substring(tagEndIndex - 10, tagEndIndex + 10)}`,
    );
    return null;
  }

  trace(
    `[DEBUG] createTagSelfCloseFix: Found tag ending '>' at position ${tagEndIndex}`,
  );

  // Create TextEdit to replace '>' with ' />'
  const edit: TextEdit = {
    range: {
      start: document.positionAt(tagEndIndex),
      end: document.positionAt(tagEndIndex + 1),
    },
    newText: " />",
  };

  trace(
    `[DEBUG] createTagSelfCloseFix: Created edit to replace '>' with ' />'`,
  );

  const action = CodeAction.create(
    "Add self-closing tag",
    {
      changes: {
        [document.uri]: [edit],
      },
    },
    CodeActionKind.QuickFix,
  );

  action.diagnostics = [diagnostic];
  action.isPreferred = true;

  trace(
    `[DEBUG] createTagSelfCloseFix: Created code action: ${JSON.stringify(action)}`,
  );

  return action;
}

/**
 * Create auto-fix action for spec-char-escape rule
 */
function createSpecCharEscapeFix(
  document: TextDocument,
  diagnostic: Diagnostic,
): CodeAction | null {
  if (
    !diagnostic.data ||
    diagnostic.data.ruleId !== "spec-char-escape" ||
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

  // Find unescaped special characters that need to be escaped
  // We need to be careful not to escape characters that are already in HTML tags or attributes
  const specialCharPattern = /([<>])/g;
  let match;
  const edits: TextEdit[] = [];

  while ((match = specialCharPattern.exec(line)) !== null) {
    const startCol = match.index;
    const endCol = startCol + match[1].length;
    const char = match[1];

    // Check if this match is at or near the diagnostic position
    const diagnosticCol = diagnostic.data.col - 1;
    if (Math.abs(startCol - diagnosticCol) <= 5) {
      // Determine if this character is inside a tag (should not be escaped)
      const beforeMatch = line.substring(0, startCol);
      const lastOpenBracket = beforeMatch.lastIndexOf("<");
      const lastCloseBracket = beforeMatch.lastIndexOf(">");

      // If we're inside a tag (after < but before >), don't escape
      if (lastOpenBracket > lastCloseBracket) {
        continue;
      }

      const lineIndex = diagnostic.data.line - 1;
      const startPos = { line: lineIndex, character: startCol };
      const endPos = { line: lineIndex, character: endCol };

      // Map characters to their HTML entities
      const entityMap: { [key: string]: string } = {
        "<": "&lt;",
        ">": "&gt;",
      };

      const replacement = entityMap[char];
      if (replacement) {
        edits.push({
          range: { start: startPos, end: endPos },
          newText: replacement,
        });
        break; // Only fix the first occurrence near the diagnostic
      }
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
    title: "Escape special character",
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true,
  };
}

/**
 * Create auto-fix action for tag-no-obsolete rule
 *
 * This fixes obsolete HTML tags by converting them to their modern equivalents.
 * Currently supports converting <acronym> tags to <abbr> tags.
 *
 * Example:
 * - Before: <acronym title="HyperText Markup Language">HTML</acronym>
 * - After:  <abbr title="HyperText Markup Language">HTML</abbr>
 */
function createTagNoObsoleteFix(
  document: TextDocument,
  diagnostic: Diagnostic,
): CodeAction | null {
  trace(
    `[DEBUG] createTagNoObsoleteFix called with diagnostic: ${JSON.stringify(diagnostic)}`,
  );

  if (!diagnostic.data || diagnostic.data.ruleId !== "tag-no-obsolete") {
    trace(`[DEBUG] createTagNoObsoleteFix: Invalid diagnostic data or ruleId`);
    return null;
  }

  const text = document.getText();
  const edits: TextEdit[] = [];

  // Find all acronym tags in the entire document
  const acronymPattern = /<\/?(acronym|ACRONYM)((?:\s+[^>]*?)?)\s*(\/?)>/gi;
  let match;
  const acronymTags: Array<{
    startOffset: number;
    endOffset: number;
    tagName: string;
    attributes: string;
    selfClosing: string;
    isClosingTag: boolean;
    fullMatch: string;
    line: number;
    column: number;
  }> = [];

  // Collect all acronym tags with their positions
  while ((match = acronymPattern.exec(text)) !== null) {
    const startOffset = match.index;
    const endOffset = startOffset + match[0].length;
    const tagName = match[1].toLowerCase();
    const attributes = match[2] || "";
    const selfClosing = match[3] || "";
    const isClosingTag = match[0].startsWith("</");

    // Only handle acronym tags for now
    if (tagName === "acronym") {
      const position = document.positionAt(startOffset);
      acronymTags.push({
        startOffset,
        endOffset,
        tagName,
        attributes,
        selfClosing,
        isClosingTag,
        fullMatch: match[0],
        line: position.line,
        column: position.character,
      });
    }
  }

  // Find the diagnostic position
  const diagnosticLine = diagnostic.data.line - 1;
  const diagnosticCol = diagnostic.data.col - 1;

  // Find the closest acronym tag to the diagnostic position
  let closestTag: (typeof acronymTags)[0] | null = null;
  let minDistance = Infinity;

  for (const tag of acronymTags) {
    const distance =
      Math.abs(tag.line - diagnosticLine) +
      Math.abs(tag.column - diagnosticCol);
    if (distance < minDistance) {
      minDistance = distance;
      closestTag = tag;
    }
  }

  if (!closestTag || minDistance > 20) {
    trace(`[DEBUG] createTagNoObsoleteFix: No close acronym tag found`);
    return null;
  }

  // If this is a self-closing tag, just convert it
  if (closestTag.selfClosing === "/") {
    const startPos = document.positionAt(closestTag.startOffset);
    const endPos = document.positionAt(closestTag.endOffset);

    edits.push({
      range: { start: startPos, end: endPos },
      newText: `<abbr${closestTag.attributes} />`,
    });
  } else if (closestTag.isClosingTag) {
    // If this is a closing tag, find its opening tag
    const openingTag = findOpeningTag(acronymTags, closestTag);
    if (openingTag) {
      // Convert both opening and closing tags
      const openingStartPos = document.positionAt(openingTag.startOffset);
      const openingEndPos = document.positionAt(openingTag.endOffset);
      const closingStartPos = document.positionAt(closestTag.startOffset);
      const closingEndPos = document.positionAt(closestTag.endOffset);

      edits.push({
        range: { start: openingStartPos, end: openingEndPos },
        newText: `<abbr${openingTag.attributes}>`,
      });
      edits.push({
        range: { start: closingStartPos, end: closingEndPos },
        newText: "</abbr>",
      });
    }
  } else {
    // If this is an opening tag, find its closing tag
    const closingTag = findClosingTag(acronymTags, closestTag);
    if (closingTag) {
      // Convert both opening and closing tags
      const openingStartPos = document.positionAt(closestTag.startOffset);
      const openingEndPos = document.positionAt(closestTag.endOffset);
      const closingStartPos = document.positionAt(closingTag.startOffset);
      const closingEndPos = document.positionAt(closingTag.endOffset);

      edits.push({
        range: { start: openingStartPos, end: openingEndPos },
        newText: `<abbr${closestTag.attributes}>`,
      });
      edits.push({
        range: { start: closingStartPos, end: closingEndPos },
        newText: "</abbr>",
      });
    }
  }

  if (edits.length === 0) {
    trace(`[DEBUG] createTagNoObsoleteFix: No edits created`);
    return null;
  }

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: edits,
    },
  };

  return {
    title: "Convert obsolete tag to modern equivalent",
    kind: CodeActionKind.QuickFix,
    edit: workspaceEdit,
    isPreferred: true,
  };
}

/**
 * Helper function to find the opening tag for a given closing tag
 */
function findOpeningTag(
  tags: Array<{
    startOffset: number;
    endOffset: number;
    tagName: string;
    attributes: string;
    selfClosing: string;
    isClosingTag: boolean;
    fullMatch: string;
    line: number;
    column: number;
  }>,
  closingTag: (typeof tags)[0],
): (typeof tags)[0] | null {
  // Find the most recent opening tag before this closing tag
  let openingTag: (typeof tags)[0] | null = null;

  for (const tag of tags) {
    if (!tag.isClosingTag && tag.startOffset < closingTag.startOffset) {
      if (!openingTag || tag.startOffset > openingTag.startOffset) {
        openingTag = tag;
      }
    }
  }

  return openingTag;
}

/**
 * Helper function to find the closing tag for a given opening tag
 */
function findClosingTag(
  tags: Array<{
    startOffset: number;
    endOffset: number;
    tagName: string;
    attributes: string;
    selfClosing: string;
    isClosingTag: boolean;
    fullMatch: string;
    line: number;
    column: number;
  }>,
  openingTag: (typeof tags)[0],
): (typeof tags)[0] | null {
  // Find the first closing tag after this opening tag
  let closingTag: (typeof tags)[0] | null = null;

  for (const tag of tags) {
    if (tag.isClosingTag && tag.startOffset > openingTag.startOffset) {
      if (!closingTag || tag.startOffset < closingTag.startOffset) {
        closingTag = tag;
      }
    }
  }

  return closingTag;
}

/**
 * Robustly find tag boundaries around a given position
 * Handles edge cases like attribute values containing < or > characters
 */
function findTagBoundaries(
  text: string,
  position: number,
): { tagStart: number; tagEnd: number } | null {
  // Start from the position and work backwards to find the opening <
  let tagStart = -1;
  let i = position;

  // Look backwards for the start of a tag
  while (i >= 0) {
    if (text[i] === "<") {
      // Found a potential tag start, now verify it's a real tag opening
      // by checking if we can find a matching > that's not inside quotes
      const tagEndResult = findTagEnd(text, i);
      if (tagEndResult && tagEndResult.tagEnd >= position) {
        // This tag contains our position
        tagStart = i;
        return { tagStart, tagEnd: tagEndResult.tagEnd };
      }
    }
    i--;
  }

  return null;
}

/**
 * Find the end of a tag starting at the given position, properly handling quotes
 */
function findTagEnd(text: string, tagStart: number): { tagEnd: number } | null {
  if (text[tagStart] !== "<") {
    return null;
  }

  let i = tagStart + 1;
  let inSingleQuote = false;
  let inDoubleQuote = false;

  while (i < text.length) {
    const char = text[i];

    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
    } else if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
    } else if (char === ">" && !inSingleQuote && !inDoubleQuote) {
      // Found the end of the tag
      return { tagEnd: i };
    } else if (char === "<" && !inSingleQuote && !inDoubleQuote) {
      // Found another tag start before closing this one - invalid
      return null;
    }

    i++;
  }

  // Reached end of text without finding tag end
  return null;
}

/**
 * Create auto-fix action for attr-no-duplication rule
 * Only fixes duplicates where the attribute values are identical
 */
function createAttrNoDuplicationFix(
  document: TextDocument,
  diagnostic: Diagnostic,
): CodeAction | null {
  trace(
    `[DEBUG] createAttrNoDuplicationFix called with diagnostic: ${JSON.stringify(diagnostic)}`,
  );

  if (!diagnostic.data || diagnostic.data.ruleId !== "attr-no-duplication") {
    trace(
      `[DEBUG] createAttrNoDuplicationFix: Invalid diagnostic data or ruleId`,
    );
    return null;
  }

  const text = document.getText();
  const lines = text.split("\n");
  const diagnosticLine = diagnostic.data.line - 1;
  const line = lines[diagnosticLine];

  if (!line) {
    trace(`[DEBUG] createAttrNoDuplicationFix: Line not found`);
    return null;
  }

  // Find the tag containing the duplicate attributes
  // Look for the opening tag that contains the diagnostic position
  const diagnosticOffset = document.offsetAt(diagnostic.range.start);

  // Use robust tag boundary detection
  const tagBoundaries = findTagBoundaries(text, diagnosticOffset);
  if (!tagBoundaries) {
    trace(`[DEBUG] createAttrNoDuplicationFix: Could not find tag boundaries`);
    return null;
  }

  const { tagStart, tagEnd } = tagBoundaries;
  const tagContent = text.substring(tagStart, tagEnd + 1);
  trace(`[DEBUG] createAttrNoDuplicationFix: Found tag: ${tagContent}`);

  // Parse attributes from the tag
  // This regex matches attribute="value" or attribute='value' or attribute=value
  const attrPattern = /(\w+(?:-\w+)*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  const attributes: Array<{
    name: string;
    value: string;
    fullMatch: string;
    startIndex: number;
    endIndex: number;
  }> = [];

  let match;
  while ((match = attrPattern.exec(tagContent)) !== null) {
    const name = match[1].toLowerCase();
    const value = match[2] || match[3] || match[4] || "";
    attributes.push({
      name,
      value,
      fullMatch: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  trace(
    `[DEBUG] createAttrNoDuplicationFix: Found ${attributes.length} attributes`,
  );

  // Find duplicate attributes with the same value
  const duplicatesToRemove: typeof attributes = [];
  const seenAttributes = new Map<string, (typeof attributes)[0]>();

  for (const attr of attributes) {
    const existing = seenAttributes.get(attr.name);
    if (existing) {
      // Found a duplicate - check if values are identical
      if (existing.value === attr.value) {
        // Values are the same, we can safely remove the duplicate
        duplicatesToRemove.push(attr);
        trace(
          `[DEBUG] createAttrNoDuplicationFix: Found duplicate ${attr.name}="${attr.value}" to remove`,
        );
      } else {
        // Values are different, don't autofix
        trace(
          `[DEBUG] createAttrNoDuplicationFix: Found duplicate ${attr.name} with different values: "${existing.value}" vs "${attr.value}" - not autofixing`,
        );
        return null;
      }
    } else {
      seenAttributes.set(attr.name, attr);
    }
  }

  if (duplicatesToRemove.length === 0) {
    trace(`[DEBUG] createAttrNoDuplicationFix: No safe duplicates to remove`);
    return null;
  }

  // Create edits to remove the duplicate attributes
  const edits: TextEdit[] = [];

  // Sort duplicates by position (reverse order to avoid offset issues)
  duplicatesToRemove.sort((a, b) => b.startIndex - a.startIndex);

  for (const duplicate of duplicatesToRemove) {
    const absoluteStart = tagStart + duplicate.startIndex;
    const absoluteEnd = tagStart + duplicate.endIndex;

    // Include any trailing whitespace after the attribute
    let endPos = absoluteEnd;
    while (endPos < text.length && /\s/.test(text[endPos])) {
      endPos++;
    }

    // Include any leading whitespace before the attribute (but not if it's the first attribute)
    let startPos = absoluteStart;
    if (duplicate.startIndex > 0) {
      while (startPos > tagStart && /\s/.test(text[startPos - 1])) {
        startPos--;
      }
    }

    edits.push({
      range: {
        start: document.positionAt(startPos),
        end: document.positionAt(endPos),
      },
      newText: "",
    });

    trace(
      `[DEBUG] createAttrNoDuplicationFix: Will remove "${text.substring(startPos, endPos)}"`,
    );
  }

  if (edits.length === 0) {
    return null;
  }

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [document.uri]: edits,
    },
  };

  const title =
    duplicatesToRemove.length === 1
      ? `Remove duplicate ${duplicatesToRemove[0].name} attribute`
      : `Remove ${duplicatesToRemove.length} duplicate attributes`;

  return {
    title,
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
        case "attr-whitespace":
          trace(`[DEBUG] Calling createAttrWhitespaceFix`);
          fix = createAttrWhitespaceFix(document, diagnostic);
          break;
        case "spec-char-escape":
          trace(`[DEBUG] Calling createSpecCharEscapeFix`);
          fix = createSpecCharEscapeFix(document, diagnostic);
          break;
        case "tag-self-close":
          trace(`[DEBUG] Calling createTagSelfCloseFix`);
          fix = createTagSelfCloseFix(document, diagnostic);
          break;
        case "tag-no-obsolete":
          trace(`[DEBUG] Calling createTagNoObsoleteFix`);
          fix = createTagNoObsoleteFix(document, diagnostic);
          break;
        case "attr-no-duplication":
          trace(`[DEBUG] Calling createAttrNoDuplicationFix`);
          fix = createAttrNoDuplicationFix(document, diagnostic);
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
  trace(`[DEBUG] Code actions: ${JSON.stringify(actions)}`);

  return actions;
}

connection.onInitialize(
  (params: InitializeParams, token: CancellationToken) => {
    let initOptions: {
      nodePath: string;
    } = params.initializationOptions;
    let nodePath = initOptions
      ? initOptions.nodePath
        ? initOptions.nodePath
        : undefined
      : undefined;

    // Since Files API is no longer available, we'll use embedded htmlhint directly
    linter = (htmlhint.default ||
      htmlhint.HTMLHint ||
      htmlhint) as typeof linter;

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
          ignoreGitignore: false,
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

    // Check if file should be ignored based on .gitignore
    if (settings.htmlhint.ignoreGitignore) {
      // Find workspace root by looking for .git directory or .gitignore file
      let workspaceRoot = findWorkspaceRoot(fsPath);
      if (workspaceRoot && shouldIgnoreFile(fsPath, workspaceRoot)) {
        trace(
          `[DEBUG] File ${fsPath} is ignored by .gitignore, skipping validation`,
        );
        // Clear any existing diagnostics for this file
        connection.sendDiagnostics({ uri, diagnostics: [] });
        return;
      }
    }

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

      // Clear gitignore cache when settings change
      gitignoreCache.clear();

      // Clear workspace root cache when settings change
      workspaceRootCache.clear();

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
        gitignoreCache.clear();
        workspaceRootCache.clear();
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

    // Process .htmlhintrc files
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

    // Process .gitignore files
    if (fsPath.endsWith(".gitignore")) {
      shouldRevalidate = true;

      // Clear gitignore cache when .gitignore changes
      trace(`[DEBUG] .gitignore file changed, clearing cache`);
      gitignoreCache.clear();

      // Clear workspace root cache since it depends on .gitignore detection
      workspaceRootCache.clear();
    }
  }

  if (shouldRevalidate) {
    trace(`[DEBUG] Triggering revalidation of all documents`);
    // Force revalidation of all documents
    validateAllTextDocuments(connection, documents.all());
  } else {
    trace(`[DEBUG] No relevant files changed, skipping revalidation`);
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

      // Normalize range if it's in array format [start, end]
      const normalizedRange = Array.isArray(range)
        ? { start: range[0], end: range[1] }
        : range;

      // Ensure range has proper structure
      if (
        !normalizedRange.start ||
        !normalizedRange.end ||
        typeof normalizedRange.start.line !== "number" ||
        typeof normalizedRange.end.line !== "number"
      ) {
        trace(`[DEBUG] Invalid range format: ${JSON.stringify(range)}`);
        return [];
      }

      // Filter diagnostics to only include those that intersect with the range
      const filteredDiagnostics = context.diagnostics.filter((diagnostic) => {
        // Ensure the diagnostic has a properly structured range
        if (
          !diagnostic.range ||
          typeof diagnostic.range.start?.line !== "number" ||
          typeof diagnostic.range.end?.line !== "number"
        ) {
          trace(
            `[DEBUG] Skipping diagnostic with invalid range: ${JSON.stringify(diagnostic)}`,
          );
          return false;
        }

        const diagnosticRange = diagnostic.range;
        return (
          diagnosticRange.start.line <= normalizedRange.end.line &&
          diagnosticRange.end.line >= normalizedRange.start.line
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
            raw:
              diagnostic.code === "tag-self-close"
                ? document
                    .getText()
                    .substring(
                      document.offsetAt(diagnostic.range.start),
                      document.offsetAt(diagnostic.range.end),
                    )
                : diagnostic.message.split(" ")[0],
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
                  changes: fix.edit.documentChanges
                    ? {
                        [uri]: (fix.edit.documentChanges[0] as any).edits || [],
                      }
                    : fix.edit.changes && fix.edit.changes[uri]
                      ? {
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
                        }
                      : { [uri]: [] },
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

/**
 * Check if a file should be ignored based on .gitignore patterns
 */
function shouldIgnoreFile(filePath: string, workspaceRoot: string): boolean {
  try {
    // Find the .gitignore file in the workspace root
    const gitignorePath = path.join(workspaceRoot, ".gitignore");

    if (!fs.existsSync(gitignorePath)) {
      return false; // No .gitignore file, so don't ignore anything
    }

    // Check cache first
    if (gitignoreCache.has(workspaceRoot)) {
      const ig = gitignoreCache.get(workspaceRoot);
      const relativePath = path.relative(workspaceRoot, filePath);
      return ig.ignores(relativePath);
    }

    // Parse .gitignore file
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
    const ig = ignore().add(gitignoreContent);

    // Cache the parsed patterns
    gitignoreCache.set(workspaceRoot, ig);

    // Check if the file should be ignored
    const relativePath = path.relative(workspaceRoot, filePath);
    return ig.ignores(relativePath);
  } catch (error) {
    trace(`[DEBUG] Error checking .gitignore for ${filePath}: ${error}`);
    return false; // On error, don't ignore the file
  }
}

/**
 * Find the workspace root directory by looking for .git directory or .gitignore file
 */
function findWorkspaceRoot(filePath: string): string | null {
  try {
    // Check cache first
    const cacheKey = path.dirname(filePath);
    if (workspaceRootCache.has(cacheKey)) {
      return workspaceRootCache.get(cacheKey);
    }

    let currentDir = path.dirname(filePath);
    const rootDir = path.parse(filePath).root;
    const visitedDirs = new Set<string>();

    while (currentDir !== rootDir && !visitedDirs.has(currentDir)) {
      visitedDirs.add(currentDir);

      // Check for .git directory or .gitignore file
      const gitPath = path.join(currentDir, ".git");
      const gitignorePath = path.join(currentDir, ".gitignore");

      if (fs.existsSync(gitPath) || fs.existsSync(gitignorePath)) {
        // Cache the result for this directory and all its subdirectories
        visitedDirs.forEach((dir) => {
          workspaceRootCache.set(dir, currentDir);
        });
        return currentDir;
      }

      // Move up one directory
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) {
        break; // Reached root
      }
      currentDir = parentDir;
    }

    // Cache negative results too
    visitedDirs.forEach((dir) => {
      workspaceRootCache.set(dir, null);
    });

    return null; // No workspace root found
  } catch (error) {
    trace(`[DEBUG] Error finding workspace root for ${filePath}: ${error}`);
    return null;
  }
}
