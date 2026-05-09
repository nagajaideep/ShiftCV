import React from 'react';
import { AlertCircle, Loader2, FileSearch, Play } from 'lucide-react';

const PdfPreview = ({ url, loading, error, onCompile }) => {
  const emptyState = loading ? (
    <>
      <Loader2 size={48} className="animate-spin text-blue-500" />
      <p>Compiling LaTeX to PDF...</p>
    </>
  ) : error ? (
    <>
      <AlertCircle size={48} className="text-red-400" />
      <div className="pdf-error-copy">
        <p>Compilation failed</p>
        <span>{error}</span>
      </div>
    </>
  ) : (
    <>
      <FileSearch size={48} />
      <p>Click Compile to generate preview</p>
    </>
  );

  return (
    <div className="pdf-preview">
      <div className="pdf-preview-toolbar">
        <span className="pdf-preview-title">PDF Preview</span>
        <button
          onClick={onCompile}
          disabled={loading}
          className="btn-secondary pdf-compile-button"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
          Compile
        </button>
      </div>

      <div className="pdf-preview-body">
        {!url ? (
          <div className="pdf-empty-state">{emptyState}</div>
        ) : (
          <>
            {error && !loading && (
              <div className="pdf-error-banner">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            {loading && (
              <div className="pdf-loading-mask">
                <Loader2 size={32} className="animate-spin text-white" />
              </div>
            )}
            <iframe
              src={`${url}#view=Fit&toolbar=0&navpanes=0`}
              className="pdf-frame"
              title="PDF Preview"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PdfPreview;
