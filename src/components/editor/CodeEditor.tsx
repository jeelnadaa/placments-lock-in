import React, { useRef, useEffect, useMemo } from 'react';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { go } from '@codemirror/lang-go';
import { oneDark } from '@codemirror/theme-one-dark';
import { indentUnit } from '@codemirror/language';
import { EditorState, Prec } from '@codemirror/state';
import { keymap, EditorView } from '@codemirror/view';
import { indentLess } from '@codemirror/commands';
import { autocompletion, acceptCompletion, startCompletion } from '@codemirror/autocomplete';
import { linter, lintGutter } from '@codemirror/lint';
import { javaCompletionSource, prefetchJavaReflection } from './javaCompletions';
import { javaLinter } from './javaLinter';
import { pythonCompletionSource } from './pythonCompletions';
import { pythonLinter } from './pythonLinter';
import { cppCompletionSource } from './cppCompletions';
import { cppLinter } from './cppLinter';
import { cCompletionSource } from './cCompletions';
import { cLinter } from './cLinter';
import { goCompletionSource } from './goCompletions';
import { goLinter } from './goLinter';
import { SupportedLanguage } from '../../types';

export interface CodeEditorProps {
  value: string;
  language?: SupportedLanguage;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  minHeight?: string;
  maxHeight?: string;
  placeholder?: string;
  fontSize?: number;
  highlightLine?: number | null;
  assistMode?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  language = 'python',
  onChange,
  readOnly = false,
  minHeight = '100%',
  maxHeight = '100%',
  placeholder,
  fontSize = 16.5,
  highlightLine,
  assistMode = true,
}) => {
  const cmRef = useRef<ReactCodeMirrorRef>(null);

  useEffect(() => {
    if (language === 'java') {
      prefetchJavaReflection();
    }
  }, [language]);

  useEffect(() => {
    if (cmRef.current?.view && highlightLine && highlightLine > 0) {
      try {
        const view = cmRef.current.view;
        const doc = view.state.doc;
        const targetLineNum = Math.min(Math.max(1, highlightLine), doc.lines);
        const lineInfo = doc.line(targetLineNum);
        view.dispatch({
          selection: { anchor: lineInfo.from },
          scrollIntoView: true,
        });
        view.focus();
      } catch {
        // ignore navigation errors
      }
    }
  }, [highlightLine]);

  // Extensions configured for 4-space indentation, custom Tab behavior, live linter, and assistMode
  const extensions = useMemo(() => {
    // Custom Tab behavior:
    // 1. If autocomplete popup is active, accept completion.
    // 2. Otherwise at any position/empty space, insert exactly 4 spaces.
    // 3. Dot key, arrow (->), and double colon (::) triggers autocompletion suggestions immediately.
    const customTabKeymap = Prec.highest(
      keymap.of([
        {
          key: 'Tab',
          run: (view) => {
            if (acceptCompletion(view)) {
              return true;
            }
            view.dispatch(view.state.replaceSelection('    '));
            return true;
          },
        },
        {
          key: 'Shift-Tab',
          run: indentLess,
        },
        {
          key: '.',
          run: (view) => {
            setTimeout(() => {
              try {
                startCompletion(view);
              } catch {
                // ignore
              }
            }, 10);
            return false;
          },
        },
        {
          key: '>',
          run: (view) => {
            setTimeout(() => {
              try {
                startCompletion(view);
              } catch {
                // ignore
              }
            }, 10);
            return false;
          },
        },
        {
          key: ':',
          run: (view) => {
            setTimeout(() => {
              try {
                startCompletion(view);
              } catch {
                // ignore
              }
            }, 10);
            return false;
          },
        },
      ])
    );

    let langExtension = java();
    let linterExtension = javaLinter;
    let completionSource = javaCompletionSource;

    if (language === 'python') {
      langExtension = python();
      linterExtension = pythonLinter;
      completionSource = pythonCompletionSource;
    } else if (language === 'cpp') {
      langExtension = cpp();
      linterExtension = cppLinter;
      completionSource = cppCompletionSource;
    } else if (language === 'c') {
      langExtension = cpp();
      linterExtension = cLinter;
      completionSource = cCompletionSource;
    } else if (language === 'go') {
      langExtension = go();
      linterExtension = goLinter;
      completionSource = goCompletionSource;
    }

    const baseExtensions = [
      langExtension,
      indentUnit.of('    '),
      EditorState.tabSize.of(4),
      customTabKeymap,
      linter(linterExtension, { delay: 200 }),
      lintGutter(),
      EditorView.theme({
        '&': {
          height: '100%',
          outline: 'none !important',
        },
        '.cm-scroller': {
          overflow: 'auto !important',
          height: '100% !important',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        },
        '.cm-content': {
          paddingBottom: '50px',
        },
        '.cm-lintRange-error': {
          backgroundImage: 'none',
          borderBottom: '2px wavy #f43f5e',
        },
        '.cm-gutter-lint': {
          width: '18px',
        },
        '.cm-lint-marker-error': {
          content: '""',
          display: 'inline-block',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: '#f43f5e',
          marginLeft: '4px',
          boxShadow: '0 0 8px rgba(244, 63, 94, 0.7)',
        },
        '.cm-tooltip': {
          zIndex: '9999 !important',
        },
        '.cm-tooltip-lint': {
          backgroundColor: '#131316 !important',
          color: '#ffe4e6 !important',
          border: '1.5px solid #9f1239 !important',
          borderRadius: '8px !important',
          padding: '10px 14px !important',
          fontSize: '14.5px !important',
          lineHeight: '1.5 !important',
          maxWidth: '550px !important',
          boxShadow: '0 14px 30px rgba(0, 0, 0, 0.8) !important',
        },
        '.cm-diagnostic': {
          padding: '4px 0 !important',
          fontSize: '14.5px !important',
          lineHeight: '1.5 !important',
        },
        '.cm-diagnostic-error': {
          color: '#fca5a5 !important',
          borderLeft: '3.5px solid #f43f5e !important',
          paddingLeft: '10px !important',
          fontWeight: '500 !important',
        },
        '.cm-diagnosticText': {
          fontSize: '14.5px !important',
          color: '#fff1f2 !important',
          fontWeight: '500 !important',
        },
        '.cm-tooltip-autocomplete': {
          fontSize: '14px !important',
          borderRadius: '8px !important',
          border: '1px solid #3f3f46 !important',
          backgroundColor: '#18181b !important',
          boxShadow: '0 14px 30px rgba(0, 0, 0, 0.7) !important',
        },
      }),
    ];

    // Assist mode toggles autocompletions suggestions ONLY
    if (assistMode) {
      baseExtensions.push(
        autocompletion({
          override: [completionSource],
          defaultKeymap: true,
          icons: true,
          activateOnTyping: true,
        })
      );
    }

    return baseExtensions;
  }, [assistMode, language]);

  const defaultPlaceholder = language === 'python'
    ? '# Enter your Python solution here...\nclass Solution:\n    def ...'
    : language === 'cpp'
    ? '// Enter your C++ solution here...\nclass Solution {\npublic:\n    ...\n};'
    : language === 'c'
    ? '// Enter your C solution here...\nint solution(...) {\n    ...\n}'
    : language === 'go'
    ? '// Enter your Go solution here...\nfunc solution(...) {\n    ...\n}'
    : '// Enter your Java solution here...\nclass Solution {\n    public ...\n}';

  return (
    <div
      className="rounded-lg border border-mono-800 overflow-hidden bg-mono-950 font-mono shadow-inner h-full flex flex-col min-h-0"
      style={{ fontSize: `${fontSize}px` }}
    >
      <CodeMirror
        ref={cmRef}
        value={value}
        height="100%"
        minHeight={minHeight}
        maxHeight={maxHeight}
        theme={oneDark}
        extensions={extensions}
        editable={!readOnly}
        readOnly={readOnly}
        placeholder={placeholder || defaultPlaceholder}
        onChange={onChange}
        className="h-full flex-1 min-h-0 overflow-hidden"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: !readOnly,
          highlightActiveLine: !readOnly,
          foldGutter: true,
          bracketMatching: true,
          closeBrackets: !readOnly,
          autocompletion: false, // overridden by custom autocompletion extension above
          indentOnInput: !readOnly,
        }}
      />
    </div>
  );
};

// Backward-compatibility export
export const JavaEditor: React.FC<CodeEditorProps> = (props) => (
  <CodeEditor {...props} language={props.language || 'java'} />
);
