import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileCode, FileType, ArrowRight, Loader2 } from 'lucide-react';

const UploadForm = ({ onTransform, loading }) => {
  const [resume, setResume] = useState(null);
  const [template, setTemplate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resume && template) {
      onTransform(resume, template);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto mt-12 glass p-8"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Files</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resume Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Current Resume (PDF/DOCX)</label>
            <div className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${resume ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-white/20'}`}>
              <input 
                type="file" 
                onChange={(e) => setResume(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".pdf,.docx"
              />
              <div className="text-center">
                <Upload className={`mx-auto mb-2 ${resume ? 'text-green-400' : 'text-gray-500'}`} size={32} />
                <p className="text-sm text-gray-300 font-medium truncate">
                  {resume ? resume.name : 'Select Resume'}
                </p>
              </div>
            </div>
          </div>

          {/* Template Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">New Template (TEX/DOCX)</label>
            <div className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${template ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 hover:border-white/20'}`}>
              <input 
                type="file" 
                onChange={(e) => setTemplate(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".tex,.docx"
              />
              <div className="text-center">
                <FileCode className={`mx-auto mb-2 ${template ? 'text-blue-400' : 'text-gray-500'}`} size={32} />
                <p className="text-sm text-gray-300 font-medium truncate">
                  {template ? template.name : 'Select Template'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button 
          disabled={!resume || !template || loading}
          className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Transforming with AI...
            </>
          ) : (
            <>
              Generate LaTeX
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default UploadForm;
