// src/components/ImageManager.tsx - VERSIÓN MEJORADA CON CARGA MÚLTIPLE
import React, { useState, useRef } from 'react';
import { 
  Upload, Image as ImageIcon, Settings, X, AlignLeft, AlignCenter, 
  AlignRight, Minimize, Maximize, AlertCircle, CheckCircle, Loader 
} from 'lucide-react';
import { ImageDisplayOptions, NewsImage, Section } from '../types/news';
import API_ROUTES from '../config/api';

interface UploadingImage {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const ImageManager: React.FC<{
  section: Section;
  onUpload: (file: File) => void;
  onRemoveImage: (imageId: string) => void;
  onSettingsChange: (imageId: string, setting: keyof ImageDisplayOptions, value: any) => void;
  uploadProgress?: number;
}> = ({ section, onUpload, onRemoveImage, onSettingsChange, uploadProgress }) => {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const [isMultiUploading, setIsMultiUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageError = (imageId: string, imageUrl: string) => {
    console.error('Error al cargar imagen:', imageUrl);
    setFailedImages((prev) => new Set(prev).add(imageId));
  };

  // Función para subir una imagen individual al servidor
  const uploadSingleImage = async (uploadingImg: UploadingImage): Promise<void> => {
    const formData = new FormData();
    formData.append('file', uploadingImg.file);

    try {
      // Actualizar estado a "uploading"
      setUploadingImages((prev) =>
        prev.map((img) =>
          img.id === uploadingImg.id ? { ...img, status: 'uploading', progress: 0 } : img
        )
      );

      const res = await fetch(API_ROUTES.UPLOAD_IMAGE, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al subir la imagen');
      }

      // Actualizar progreso a 100% y marcar como exitosa
      setUploadingImages((prev) =>
        prev.map((img) =>
          img.id === uploadingImg.id 
            ? { ...img, status: 'success', progress: 100 } 
            : img
        )
      );

      // Llamar al callback original con el archivo para agregarlo a la sección
      onUpload(uploadingImg.file);

      return Promise.resolve();
    } catch (err: any) {
      console.error('Error subiendo imagen:', err);
      
      // Marcar como error
      setUploadingImages((prev) =>
        prev.map((img) =>
          img.id === uploadingImg.id
            ? { ...img, status: 'error', error: err.message }
            : img
        )
      );

      return Promise.reject(err);
    }
  };

  // Función para procesar múltiples imágenes con concurrencia controlada
  const processMultipleUploads = async (files: UploadingImage[]) => {
    const MAX_CONCURRENT = 3; // Máximo 3 cargas simultáneas
    const queue = [...files];
    const executing: Promise<void>[] = [];

    while (queue.length > 0 || executing.length > 0) {
      // Mientras haya espacio y archivos pendientes, iniciar nuevas cargas
      while (executing.length < MAX_CONCURRENT && queue.length > 0) {
        const img = queue.shift()!;
        const promise = uploadSingleImage(img).finally(() => {
          executing.splice(executing.indexOf(promise), 1);
        });
        executing.push(promise);
      }

      // Esperar a que al menos una termine
      if (executing.length > 0) {
        await Promise.race(executing);
      }
    }
  };

  // Handler para selección múltiple
  const handleMultipleFilesSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsMultiUploading(true);

    // Convertir FileList a array y crear objetos de carga
    const filesArray = Array.from(files);
    const newUploadingImages: UploadingImage[] = filesArray.map((file) => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending' as const,
    }));

    setUploadingImages(newUploadingImages);

    try {
      // Procesar todas las cargas
      await processMultipleUploads(newUploadingImages);

      // Limpiar las imágenes procesadas después de 2 segundos
      setTimeout(() => {
        setUploadingImages([]);
        setIsMultiUploading(false);
      }, 2000);
    } catch (err) {
      console.error('Error en carga múltiple:', err);
      setIsMultiUploading(false);
    }
  };

  // Handler para selección única (mantener compatibilidad)
  const handleSingleFileSelect = (file: File) => {
    onUpload(file);
  };

  // Calcular progreso total
  const totalProgress = uploadingImages.length > 0
    ? Math.round(
        uploadingImages.reduce((sum, img) => sum + img.progress, 0) / uploadingImages.length
      )
    : 0;

  const successCount = uploadingImages.filter((img) => img.status === 'success').length;
  const errorCount = uploadingImages.filter((img) => img.status === 'error').length;

  return (
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
        <ImageIcon size={16} className="mr-1 text-blue-600" />
        Imágenes de la Sección
      </label>

      {/* Área de carga con soporte múltiple */}
      <div className="space-y-4">
        {/* Botón de carga múltiple */}
        <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 p-6 rounded-lg flex flex-col items-center transition-all hover:border-blue-400 hover:bg-blue-50 group">
          {uploadProgress !== undefined ? (
            <div className="w-full">
              <div className="flex justify-between text-sm mb-1">
                <span>Subiendo imagen...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : isMultiUploading ? (
            <div className="w-full">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">
                  Procesando {uploadingImages.length} imagen(es)...
                </span>
                <span className="text-blue-600 font-semibold">{totalProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${totalProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-center space-x-4 text-xs">
                <span className="flex items-center text-green-600">
                  <CheckCircle size={14} className="mr-1" />
                  Exitosas: {successCount}
                </span>
                {errorCount > 0 && (
                  <span className="flex items-center text-red-600">
                    <AlertCircle size={14} className="mr-1" />
                    Errores: {errorCount}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <>
              <Upload className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" size={28} />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 1) {
                    handleMultipleFilesSelect(e.target.files);
                  } else if (e.target.files && e.target.files[0]) {
                    handleSingleFileSelect(e.target.files[0]);
                  }
                  e.target.value = ''; // Reset input
                }}
              />
              <p className="text-gray-600 text-sm font-medium">
                {section.images.length > 0 ? 'Añadir más imágenes' : 'Seleccionar imágenes'}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Arrastra aquí o haz clic • JPG, PNG, GIF • Múltiples archivos permitidos
              </p>
            </>
          )}
        </div>

        {/* Preview de imágenes en proceso de carga */}
        {uploadingImages.length > 0 && (
          <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Loader className="animate-spin mr-2" size={16} />
              Cargando imágenes...
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {uploadingImages.map((img) => (
                <div
                  key={img.id}
                  className="relative rounded-lg overflow-hidden border-2 transition-all"
                  style={{
                    borderColor:
                      img.status === 'success'
                        ? '#10b981'
                        : img.status === 'error'
                        ? '#ef4444'
                        : img.status === 'uploading'
                        ? '#3b82f6'
                        : '#d1d5db',
                  }}
                >
                  <img
                    src={img.preview}
                    alt="Preview"
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    {img.status === 'pending' && (
                      <div className="text-white text-xs">En cola...</div>
                    )}
                    {img.status === 'uploading' && (
                      <div className="text-white text-center">
                        <Loader className="animate-spin mx-auto mb-1" size={20} />
                        <div className="text-xs">{img.progress}%</div>
                      </div>
                    )}
                    {img.status === 'success' && (
                      <CheckCircle className="text-green-400" size={32} />
                    )}
                    {img.status === 'error' && (
                      <div className="text-white text-center px-2">
                        <AlertCircle className="text-red-400 mx-auto mb-1" size={24} />
                        <div className="text-xs">{img.error || 'Error'}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Imágenes ya subidas (mantener funcionalidad original) */}
      {section.images.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <ImageIcon size={16} className="mr-2 text-blue-600" />
            Imágenes en la sección ({section.images.length})
          </h4>
          <div className="grid grid-cols-1 gap-4">
            {section.images.map((image) => {
              const hasFailed = failedImages.has(image.id);

              return (
                <div
                  key={image.id}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <div
                      className={`overflow-hidden relative ${
                        image.displayOptions.alignment === 'left'
                          ? 'mr-auto'
                          : image.displayOptions.alignment === 'right'
                          ? 'ml-auto'
                          : 'mx-auto'
                      } ${
                        image.displayOptions.size === 'small'
                          ? 'max-w-xs'
                          : image.displayOptions.size === 'medium'
                          ? 'max-w-md'
                          : image.displayOptions.size === 'large'
                          ? 'max-w-lg'
                          : 'w-full'
                      }`}
                    >
                      {hasFailed ? (
                        <div className="w-full h-48 flex flex-col items-center justify-center bg-gray-100 border border-gray-200 rounded">
                          <AlertCircle size={24} className="text-red-500 mb-2" />
                          <p className="text-sm text-gray-600">No se pudo cargar la imagen</p>
                        </div>
                      ) : (
                        <img
                          src={image.url}
                          alt="Vista previa"
                          className={`w-full border border-gray-100 ${
                            image.displayOptions.cropMode === 'cover'
                              ? 'object-cover h-48'
                              : image.displayOptions.cropMode === 'contain'
                              ? 'object-contain h-48'
                              : 'object-none'
                          }`}
                          onError={(e) => {
                            handleImageError(image.id, image.url);
                            e.currentTarget.src = '/placeholder-image.jpg';
                          }}
                          onLoad={() => console.log('Imagen cargada correctamente:', image.url)}
                        />
                      )}
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedImageId(selectedImageId === image.id ? null : image.id)
                          }
                          className="bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors shadow-md hover:scale-110"
                        >
                          <Settings size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveImage(image.id)}
                          className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-md hover:scale-110"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                    {selectedImageId === image.id && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <Settings size={14} className="mr-1 text-blue-500" />
                          Opciones de visualización
                        </h4>
                        <div className="mb-4">
                          <label className="text-xs text-gray-600 block mb-1.5 font-medium">Tamaño</label>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => onSettingsChange(image.id, 'size', 'small')}
                              className={`p-2 rounded ${
                                image.displayOptions.size === 'small'
                                  ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title="Pequeño"
                            >
                              <Minimize size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onSettingsChange(image.id, 'size', 'medium')}
                              className={`p-2 rounded ${
                                image.displayOptions.size === 'medium'
                                  ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title="Mediano"
                            >
                              <ImageIcon size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onSettingsChange(image.id, 'size', 'large')}
                              className={`p-2 rounded ${
                                image.displayOptions.size === 'large'
                                  ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title="Grande"
                            >
                              <Maximize size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onSettingsChange(image.id, 'size', 'full')}
                              className={`p-2 rounded ${
                                image.displayOptions.size === 'full'
                                  ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title="Completo"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <line x1="21" y1="3" x2="3" y2="21" />
                                <line x1="3" y1="3" x2="21" y2="21" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="text-xs text-gray-600 block mb-1.5 font-medium">Alineación</label>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => onSettingsChange(image.id, 'alignment', 'left')}
                              className={`p-2 rounded ${
                                image.displayOptions.alignment === 'left'
                                  ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title="Izquierda"
                            >
                              <AlignLeft size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onSettingsChange(image.id, 'alignment', 'center')}
                              className={`p-2 rounded ${
                                image.displayOptions.alignment === 'center'
                                  ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title="Centro"
                            >
                              <AlignCenter size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onSettingsChange(image.id, 'alignment', 'right')}
                              className={`p-2 rounded ${
                                image.displayOptions.alignment === 'right'
                                  ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title="Derecha"
                            >
                              <AlignRight size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="text-xs text-gray-600 block mb-1.5 font-medium">Modo de recorte</label>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => onSettingsChange(image.id, 'cropMode', 'cover')}
                              className={`p-2 rounded text-xs ${
                                image.displayOptions.cropMode === 'cover'
                                  ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title="Cubrir"
                            >
                              <span>Cubrir</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onSettingsChange(image.id, 'cropMode', 'contain')}
                              className={`p-2 rounded text-xs ${
                                image.displayOptions.cropMode === 'contain'
                                  ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title="Contener"
                            >
                              <span>Contener</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onSettingsChange(image.id, 'cropMode', 'none')}
                              className={`p-2 rounded text-xs ${
                                image.displayOptions.cropMode === 'none'
                                  ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title="Original"
                            >
                              <span>Original</span>
                            </button>
                          </div>
                        </div>
                        <div className="mb-1">
                          <label className="text-xs text-gray-600 block mb-1.5 font-medium">Leyenda</label>
                          <input
                            type="text"
                            value={image.displayOptions.caption || ''}
                            onChange={(e) => onSettingsChange(image.id, 'caption', e.target.value)}
                            placeholder="Añadir una leyenda para esta imagen...."
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                    {image.displayOptions.caption && (
                      <p className="text-sm text-gray-600 mt-1 text-center italic px-3 py-2">
                        {image.displayOptions.caption}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageManager;