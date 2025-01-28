// src/components/ui/FileDropzone.jsx
import React, { useCallback } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const FileDropzone = ({ onFileAccepted, loading = false }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      onFileAccepted(acceptedFiles[0]);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        hover:border-gray-400 transition-colors duration-200
        flex flex-col items-center justify-center cursor-pointer
      `}
    >
      <input {...getInputProps()} />
      {loading ? (
        <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
      ) : (
        <Upload className="h-10 w-10 text-gray-400" />
      )}
      <p className="mt-4 text-sm text-gray-600">
        {isDragActive
          ? 'Suelta el archivo aquí...'
          : 'Arrastra un archivo Excel o haz clic para seleccionar'}
      </p>
      <p className="mt-2 text-xs text-gray-500">
        Solo archivos .xlsx o .xls
      </p>
    </div>
  );
};

export default FileDropzone;