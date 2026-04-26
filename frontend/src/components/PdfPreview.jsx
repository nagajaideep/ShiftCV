import React from 'react';
import { Loader2, FileSearch } from 'lucide-react';

const PdfPreview = ({ url, loading }) => {
  if (loading && !url) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
        <Loader2 size={48} className="animate-spin text-blue-500" />
        <p>Compiling LaTeX to PDF...</p>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
        <FileSearch size={48} />
        <p>Click "Compile" to generate preview</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      {loading && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
          <Loader2 size={32} className="animate-spin text-white" />
        </div>
      )}
      <iframe
        src={`${url}#view=FitH`}
        className="w-full h-full border-none"
        title="PDF Preview"
      />
    </div>
  );
};

export default PdfPreview;
