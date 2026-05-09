import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

const LatexEditor = ({ value, onChange }) => {
  return (
    <div className="latex-editor">
      <CodeMirror
        value={value}
        height="100%"
        theme={vscodeDark}
        extensions={[javascript()]} // Using JS as a fallback for highlighting if LaTeX is not ready
        onChange={(val) => onChange(val)}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
        }}
      />
    </div>
  );
};

export default LatexEditor;
