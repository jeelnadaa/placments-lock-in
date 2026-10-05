import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';

interface JavaEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  minHeight?: string;
  maxHeight?: string;
  placeholder?: string;
}

export const JavaEditor: React.FC<JavaEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  minHeight = '320px',
  maxHeight = '650px',
  placeholder = '// Enter your Java solution here...\nclass Solution {\n    public ...\n}',
}) => {
  return (
    <div className="rounded-lg border border-mono-800 overflow-hidden bg-mono-950 font-mono text-sm shadow-inner">
      <CodeMirror
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
