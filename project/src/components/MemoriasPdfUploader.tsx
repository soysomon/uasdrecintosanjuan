import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, AlertTriangle, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface MemoriasPdfUploaderProps {
  onPdfUploaded: (url: string, publicId: string) => void;
  currentPdfUrl?: string;
  title?: string;
}

const MemoriasPdfUploader: React.FC<MemoriasPdfUploaderProps> = ({
  onPdfUploaded,
  currentPdfUrl,
  title = 'Documento PDF',
}) => {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePdfUpload = async (file: File) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Solo se permiten archivos PDF', {
        icon: <AlertTriangle className="text-red-500" size={18} />,
      });
      return;
    }

    console.log('Archivo PDF a subir:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Paso 1: Obtener la URL pre-firmada
      const res = await axios.get('http://localhost:5000/api/get-upload-url', {
        params: { fileName: file.name },
      });

      if (!res.data.success) {
        throw new Error('Error al obtener URL de subida: ' + (res.data.error || 'Respuesta inválida'));
      }

      const { uploadUrl, pdfUrl, fileKey } = res.data;
      console.log('URL pre-firmada recibida:', uploadUrl);

      // Paso 2: Subir directamente a S3 con instancia limpia
      const s3Axios = axios.create();
      delete s3Axios.defaults.headers.common['Authorization']; // Sin token Bearer

      await s3Axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': 'application/pdf', // Solo este encabezado
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setUploadProgress(percentCompleted);
          console.log(`Progreso: ${percentCompleted}%`);
        },
        timeout: 0, // Sin timeout para archivos grandes
      });

      console.log('PDF subido a:', pdfUrl);
      console.log('Public ID:', fileKey);

      toast.success('PDF cargado correctamente', {
        icon: <Check className="text-green-500" size={18} />,
      });

      onPdfUploaded(pdfUrl, fileKey);
    } catch (err) {
      console.error('Error al subir PDF:', err);
      let errorMessage = 'Error al subir el PDF.';
      if (axios.isAxiosError(err) && err.response) {
        console.error('Detalles del error:', err.response.data);
        errorMessage += ` Error ${err.response.status}: ${err.response.data.error || err.response.statusText}`;
      } else if (err instanceof Error) {
        errorMessage += ` ${err.message}`;
      }
      toast.error(errorMessage, {
        icon: <AlertTriangle className="text-red-500" size={18} />,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
        <FileText size={16} className="mr-1 text-blue-600" />
        {title}
      </label>
      <div className="relative border border-dashed border-gray-300 bg-gray-50 p-6 rounded-lg flex flex-col items-center transition-all hover:border-blue-400 hover:bg-blue-50">
        {uploadProgress !== null ? (
          <div className="w-full">
            <div className="flex justify-between text-sm mb-1">
              <span>Subiendo documento...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <>
            <Upload className="text-blue-500 mb-2" size={28} />
            <input
              type="file"
              accept="application/pdf"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              onChange={(e) => e.target.files && handlePdfUpload(e.target.files[0])}
              disabled={isUploading}
            />
            <p className="text-gray-600 text-sm font-medium">
              {currentPdfUrl ? 'Cambiar PDF' : 'Seleccionar PDF'}
            </p>
            <p className="text-gray-500 text-xs mt-1">Solo archivos PDF</p>
          </>
        )}
      </div>
      {currentPdfUrl && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="text-blue-600 mr-2" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-700">Documento cargado</p>
              <a
                href={currentPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                Ver documento
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onPdfUploaded('', '')}
            className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoriasPdfUploader;