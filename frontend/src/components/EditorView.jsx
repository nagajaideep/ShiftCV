import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, ChevronLeft } from 'lucide-react';
import LatexEditor from './LatexEditor';
import PdfPreview from './PdfPreview';
import { compileLatex } from '../api';

const autoCompileRequests = new Map();

const getAutoCompileRequest = (latex) => {
  if (!autoCompileRequests.has(latex)) {
    const request = compileLatex(latex).catch((err) => {
      autoCompileRequests.delete(latex);
      throw err;
    });
    autoCompileRequests.set(latex, request);
  }

  return autoCompileRequests.get(latex);
};

const EditorView = ({ initialLatex }) => {
  const [latex, setLatex] = useState(initialLatex);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [compiling, setCompiling] = useState(false);
  const [compileError, setCompileError] = useState('');

  const runCompile = useCallback(async (compileRequest) => {
    setCompiling(true);
    setCompileError('');
    try {
      const url = await compileRequest();
      setPdfUrl(url);
    } catch (err) {
      console.error("Compilation failed", err);
      setCompileError(err.message || 'Compilation failed. Please check your LaTeX and try again.');
    } finally {
      setCompiling(false);
    }
  }, []);

  const handleCompile = useCallback(() => {
    return runCompile(() => compileLatex(latex));
  }, [latex, runCompile]);

  useEffect(() => {
    if (!initialLatex) return undefined;

    let cancelled = false;
    setCompiling(true);
    setCompileError('');

    getAutoCompileRequest(initialLatex)
      .then((url) => {
        if (!cancelled) setPdfUrl(url);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Initial compilation failed", err);
          setCompileError(err.message || 'Compilation failed. Please check your LaTeX and try again.');
        }
      })
      .finally(() => {
        if (!cancelled) setCompiling(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialLatex]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="editor-shell"
    >
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="flex items-center gap-4">
          <button className="icon-button" aria-label="Back">
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-gray-300">resume_edited.tex</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Editor & Preview Split */}
      <div className="editor-split">
        <div className="latex-pane">
          <LatexEditor value={latex} onChange={setLatex} />
        </div>
        <div className="pdf-pane">
          <PdfPreview
            url={pdfUrl}
            loading={compiling}
            error={compileError}
            onCompile={handleCompile}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default EditorView;
