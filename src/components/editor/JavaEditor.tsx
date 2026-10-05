import React, { useRef, useEffect } from 'react';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';

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
  fontSize = 15,
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

  return (
    <div
      className="rounded-lg border border-mono-800 overflow-hidden bg-mono-950 font-mono shadow-inner"
      style={{ fontSize: `${fontSize}px` }}
    >
      <CodeMirror
        ref={cmRef}
        value={value}
        height="100%"
        minHeight={minHeight}
        maxHeight={maxHeight}
        theme={oneDark}
        extensions={[java()]}
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
          autocompletion: !readOnly,
          indentOnInput: !readOnly,
        }}
      />
    </div>
  );
};
