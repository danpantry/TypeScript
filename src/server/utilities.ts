/// <reference path="..\services\services.ts" />

namespace ts.server {
    export interface Logger {
        close(): void;
        isVerbose(): boolean;
        loggingEnabled(): boolean;
        perftrc(s: string): void;
        info(s: string): void;
        startGroup(): void;
        endGroup(): void;
        msg(s: string, type?: string): void;
    }

    export function getDefaultFormatCodeSettings(host: ServerHost): FormatCodeSettings {
        return {
            indentSize: 4,
            tabSize: 4,
            newLineCharacter: host.newLine || "\n",
            convertTabsToSpaces: true,
            indentStyle: ts.IndentStyle.Smart,
            insertSpaceAfterCommaDelimiter: true,
            insertSpaceAfterSemicolonInForStatements: true,
            insertSpaceBeforeAndAfterBinaryOperators: true,
            insertSpaceAfterKeywordsInControlFlowStatements: true,
            insertSpaceAfterFunctionKeywordForAnonymousFunctions: false,
            insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
            insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: false,
            insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: false,
            placeOpenBraceOnNewLineForFunctions: false,
            placeOpenBraceOnNewLineForControlBlocks: false,
        };
    }

    export function mergeMaps(target: Map<any>, source: Map<any>): void {
        for (const key in source) {
            if (hasProperty(source, key)) {
                target[key] = source[key];
            }
        }
    }

    export function removeItemFromSet<T>(items: T[], itemToRemove: T) {
        if (items.length === 0) {
            return;
        }
        const index = items.indexOf(itemToRemove);
        if (index < 0) {
            return;
        }
        if (items.length === 1) {
            items.pop();
        }
        else {
            items[index] = items.pop();
        }
    }
    

    export type NormalizedPath = string & { __normalizedPathTag: any };

    export function toNormalizedPath(fileName: string): NormalizedPath {
        return <NormalizedPath>normalizePath(fileName);
    }

    export function asNormalizedPath(fileName: string): NormalizedPath {
        return <NormalizedPath>fileName;
    }

    export function asNormalizedPathArray(fileNames: string[]): NormalizedPath[] {
        return <NormalizedPath[]>fileNames;
    }

    export interface NormalizedPathMap<T> {
        get (path: NormalizedPath): T;
        set (path: NormalizedPath, value: T): void;
        contains(path: NormalizedPath): boolean;
        remove(path: NormalizedPath): void;
    }

    export function createNormalizedPathMap<T>(): NormalizedPathMap<T> {
        const map: Map<T> = Object.create(null);
        return {
            get(path) {
                return map[path];
            },
            set(path, value) {
                map[path] = value;
            },
            contains(path) {
                return hasProperty(map, path);
            },
            remove(path) {
                delete map[path]
            }
        }
    }
    function throwLanguageServiceIsDisabledError() {;
        throw new Error("LanguageService is disabled");
    }

    export const nullLanguageService: LanguageService = {
        cleanupSemanticCache:           (): any => throwLanguageServiceIsDisabledError(),
        getSyntacticDiagnostics:        (): any => throwLanguageServiceIsDisabledError(),
        getSemanticDiagnostics:         (): any => throwLanguageServiceIsDisabledError(),
        getCompilerOptionsDiagnostics:  (): any => throwLanguageServiceIsDisabledError(),
        getSyntacticClassifications:    (): any => throwLanguageServiceIsDisabledError(),
        getEncodedSyntacticClassifications: (): any => throwLanguageServiceIsDisabledError(),
        getSemanticClassifications: 	(): any => throwLanguageServiceIsDisabledError(),
        getEncodedSemanticClassifications:  (): any => throwLanguageServiceIsDisabledError(),
        getCompletionsAtPosition:       (): any => throwLanguageServiceIsDisabledError(),
        findReferences:                 (): any => throwLanguageServiceIsDisabledError(),
        getCompletionEntryDetails:      (): any => throwLanguageServiceIsDisabledError(),
        getQuickInfoAtPosition:         (): any => throwLanguageServiceIsDisabledError(),
        findRenameLocations:            (): any => throwLanguageServiceIsDisabledError(),
        getNameOrDottedNameSpan:        (): any => throwLanguageServiceIsDisabledError(),
        getBreakpointStatementAtPosition:   (): any => throwLanguageServiceIsDisabledError(),
        getBraceMatchingAtPosition:     (): any => throwLanguageServiceIsDisabledError(),
        getSignatureHelpItems:          (): any => throwLanguageServiceIsDisabledError(),
        getDefinitionAtPosition: 	    (): any => throwLanguageServiceIsDisabledError(),
        getRenameInfo:                  (): any => throwLanguageServiceIsDisabledError(),
        getTypeDefinitionAtPosition:    (): any => throwLanguageServiceIsDisabledError(),
        getReferencesAtPosition:        (): any => throwLanguageServiceIsDisabledError(),
        getDocumentHighlights:          (): any => throwLanguageServiceIsDisabledError(),
        getOccurrencesAtPosition:       (): any => throwLanguageServiceIsDisabledError(),
        getNavigateToItems:             (): any => throwLanguageServiceIsDisabledError(),
        getNavigationBarItems:          (): any => throwLanguageServiceIsDisabledError(),
        getOutliningSpans:              (): any => throwLanguageServiceIsDisabledError(),
        getTodoComments:                (): any => throwLanguageServiceIsDisabledError(),
        getIndentationAtPosition:       (): any => throwLanguageServiceIsDisabledError(),
        getFormattingEditsForRange:     (): any => throwLanguageServiceIsDisabledError(),
        getFormattingEditsForDocument:  (): any => throwLanguageServiceIsDisabledError(),
        getFormattingEditsAfterKeystroke:   (): any => throwLanguageServiceIsDisabledError(),
        getDocCommentTemplateAtPosition:    (): any => throwLanguageServiceIsDisabledError(),
        isValidBraceCompletionAtPostion:    (): any => throwLanguageServiceIsDisabledError(),
        getEmitOutput:                  (): any => throwLanguageServiceIsDisabledError(),
        getProgram:                     (): any => throwLanguageServiceIsDisabledError(),
        getNonBoundSourceFile:          (): any => throwLanguageServiceIsDisabledError(),
        dispose:                        (): any => throwLanguageServiceIsDisabledError(),
    };

    export interface ServerLanguageServiceHost {
        setCompilationSettings(options: CompilerOptions): void;
        notifyFileRemoved(info: ScriptInfo): void;
    }

    export const nullLanguageServiceHost: ServerLanguageServiceHost = {
        setCompilationSettings: () => undefined,
        notifyFileRemoved: () => undefined
    };

    export interface ProjectOptions {
        /**
         * true if config file explicitly listed files
         **/
        configHasFilesProperty?: boolean;
        /**
         * these fields can be present in the project file
         **/
        files?: string[];
        wildcardDirectories?: Map<WatchDirectoryFlags>;
        compilerOptions?: CompilerOptions;
    }

    export function isInferredProjectName(name: string) {
        // POSIX defines /dev/null as a device - there should be no file with this prefix
        return /dev\/null\/inferredProject\d+\*/.test(name);
    }

    export function makeInferredProjectName(counter: number) {
        return `/dev/null/inferredProject${counter}*`;
    }    
}