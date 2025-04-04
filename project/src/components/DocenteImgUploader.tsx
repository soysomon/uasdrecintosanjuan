import React, { useState, useRef } from 'react';
import { Upload, Trash2, Loader, Check, AlertTriangle, Image } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface DocenteImgUploaderProps {
  onImageUploaded: (url: string, publicId: string) => void;
  currentImageUrl?: string;
  title?: string;
}

const DocenteImgUploader: React.FC<DocenteImgUploaderProps> = ({
  onImageUploaded,
  currentImageUrl = '',
  title = 'Foto del Docente'
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para subir imagen - Modificada para usar el endpoint del servidor
  const uploadImage = async (file: File) => {
    // Verificar si el archivo es una imagen válida
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecciona un archivo de imagen válido (JPG, PNG, etc.)', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      return;
    }

    // Verificar tamaño del archivo (límite de 5MB)
    const fileSize = file.size / 1024 / 1024; // Convertir a MB
    if (fileSize > 5) {
      toast.error('La imagen es demasiado grande. El tamaño máximo es 5MB.', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Usar el endpoint del servidor en lugar de subir directamente a Cloudinary
      console.log('Enviando imagen al servidor (docente)...');
      const res = await axios.post(
        'http://localhost:5000/api/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 100)
            );
            console.log(`Progreso de carga (docente): ${percentCompleted}%`);
            setUploadProgress(percentCompleted);
          }
        }
      );

      console.log('Respuesta del servidor (docente):', res.data);

      // Verificar respuesta correcta
      if (res.data.success) {
        // Notificar éxito
        toast.success('Imagen subida correctamente', {
          icon: <Check className="text-green-500" size={18} />
        });

        // Llamar al callback con la URL de la imagen
        onImageUploaded(res.data.imageUrl, res.data.public_id || '');
      } else {
        throw new Error(res.data.error || 'Error al subir la imagen');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen. Inténtalo de nuevo.', {
        icon: <AlertTriangle className="text-red-500" size={18} />
      });
    } finally {
      setUploading(false);
    }
  };

  // Manejar selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  // Manejar click en botón de cargar
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-600 mb-2">
        {title}
      </label>

      <div className="flex items-start gap-4">
        {/* Zona de previsualización */}
        <div className="flex-shrink-0">
          {currentImageUrl ? (
            <div className="relative rounded-lg overflow-hidden h-48 w-48 border border-gray-200 bg-gray-100">
              <img
                src={currentImageUrl}
                alt="Vista previa"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 w-48 border border-dashed border-gray-300 bg-gray-50 rounded-lg">
              <Image size={48} className="text-gray-300" />
            </div>
          )}
        </div>

        {/* Panel de carga y controles */}
        <div className="flex-grow space-y-3">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={handleUploadClick}
              disabled={uploading}
              className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                uploading
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              {uploading ? (
                <>
                  <Loader className="animate-spin mr-2" size={16} />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  {currentImageUrl ? 'Cambiar Imagen' : 'Subir Imagen'}
                </>
              )}
            </button>

            {currentImageUrl && !uploading && (
              <button
                type="button"
                onClick={() => onImageUploaded('', '')}
                className="ml-2 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
              >
                <Trash2 size={16} className="mr-2" />
                Eliminar
              </button>
            )}
          </div>

          {uploading && (
            <div className="w-full">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Subiendo imagen...</span>
                <span className="text-blue-600 font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500">
            Formatos admitidos: JPG, PNG, GIF. Tamaño máximo: 5MB.
            <br />
            Se recomienda una imagen cuadrada de al menos 300x300 píxeles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocenteImgUploader;
