// src/admin/components/ImageManager.tsx
import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Settings, X, AlignLeft, AlignCenter, AlignRight, Minimize, Maximize, AlertCircle } from 'lucide-react';
import { ImageDisplayOptions, NewsImage, Section } from '../types/news';

const ImageManager: React.FC<{
  section: Section;
  onUpload: (file: File) => void;
  onRemoveImage: (imageId: string) => void;
  onSettingsChange: (imageId: string, setting: keyof ImageDisplayOptions, value: any) => void;
  uploadProgress?: number;
}> = ({ section, onUpload, onRemoveImage, onSettingsChange, uploadProgress }) => {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (imageId: string, imageUrl: string) => {
    console.error('Error al cargar la imagen:', imageUrl);
    setFailedImages((prev) => new Set(prev).add(imageId));
  };

  return (
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
        <ImageIcon size={16} className="mr-1 text-blue-600" />
        Imágenes de la Sección
      </label>
      <div className="relative border border-dashed border-gray-300 bg-gray-50 p-6 rounded-lg flex flex-col items-center transition-all hover:border-blue-400 hover:bg-blue-50 group">
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
        ) : (
          <>
            <Upload className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" size={28} />
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              onChange={(e) => e.target.files && e.target.files[0] && onUpload(e.target.files[0])}
            />
            <p className="text-gray-600 text-sm font-medium">
              {section.images.length > 0 ? 'Añadir otra imagen' : 'Seleccionar imagen'}
            </p>
            <p className="text-gray-500 text-xs mt-1">Formatos: JPG, PNG, GIF</p>
          </>
        )}
      </div>
      {section.images.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4">
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
      )}
    </div>
  );
};

export default ImageManager;