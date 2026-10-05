import React, { useRef, useEffect, useMemo } from 'react';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';
import { indentUnit } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { autocompletion } from '@codemirror/autocomplete';
import { javaCompletionSource } from './javaCompletions';

interface JavaEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  minHeight?: string;
  maxHeight?: string;
  placeholder?: string;
  fontSize?: number;
  highlightLine?: number | null;
}

export const JavaEditor: React.FC<JavaEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  minHeight = '320px',
  maxHeight = '650px',
  placeholder = '// Enter your Java solution here...\nclass Solution {\n    public ...\n}',
  fontSize = 16.5,
  highlightLine,
}) => {
  const cmRef = useRef<ReactCodeMirrorRef>(null);

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

  // Extensions configured for 4-space indentation and rich Java autocompletion
  const extensions = useMemo(() => {
    return [
      java(),
      indentUnit.of('    '),
      EditorState.tabSize.of(4),
      keymap.of([indentWithTab]),
      autocompletion({
        override: [javaCompletionSource],
        defaultKeymap: true,
        icons: true,
      }),
    ];
  }, []);

  return (
    <div
      className="rounded-lg border border-mono-800 overflow-hidden bg-mono-950 font-mono shadow-inner h-full flex flex-col"
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
        placeholder={placeholder}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: !readOnly,
          highlightActiveLine: !readOnly,
          foldGutter: true,
          bracketMatching: true,
          closeBrackets: !readOnly,
          autocompletion: false, // overridden by our custom autocompletion extension above
          indentOnInput: !readOnly,
        }}
      />
    </div>
  );
};
