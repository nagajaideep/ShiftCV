import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Play, Save, ChevronLeft, Loader2 } from 'lucide-react';
import LatexEditor from './LatexEditor';
import PdfPreview from './PdfPreview';
import { compileLatex } from '../api';

const EditorView = ({ initialLatex }) => {
  const [latex, setLatex] = useState(initialLatex);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [compiling, setCompiling] = useState(false);

  const handleCompile = async () => {
    setCompiling(true);
    try {
      const url = await compileLatex(latex);
      setPdfUrl(url);
    } catch (err) {
      console.error("Compilation failed", err);
    } finally {
      setCompiling(false);
    }
  };

  useEffect(() => {
    if (initialLatex) handleCompile();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-80px)] flex flex-col"
    >
      {/* Toolbar */}
      <div className="p-3 border-b border-white/5 bg-white/5 flex justify-between items-center px-6">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-gray-300">resume_edited.tex</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCompile} 
            disabled={compiling}
            className="btn-secondary flex items-center gap-2 py-2 px-4 text-sm"
          >
            {compiling ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            Compile
          </button>
          <button className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Editor & Preview Split */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r border-white/10 overflow-auto bg-[#1e1e1e]">
          <LatexEditor value={latex} onChange={setLatex} />
        </div>
        <div className="w-1/2 bg-gray-900">
          <PdfPreview url={pdfUrl} loading={compiling} />
        </div>
      </div>
    </motion.div>
  );
};

export default EditorView;
