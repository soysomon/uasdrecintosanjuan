// src/types/news.ts
export interface ImageDisplayOptions {
  size: 'small' | 'medium' | 'large' | 'full';
  alignment: 'left' | 'center' | 'right';
  caption?: string;
  cropMode: 'cover' | 'contain' | 'none';
  // Eliminamos 'layout' porque no está en el esquema de MongoDB
}

export interface NewsImage {
  id: string; // Aseguramos que 'id' sea obligatorio y string
  url: string;
  publicId?: string;
  displayOptions: ImageDisplayOptions;
}

export interface Section {
  id: string; // Aseguramos que 'id' sea obligatorio y string
  images: NewsImage[];
  text: string;
  videoUrl?: string;
}