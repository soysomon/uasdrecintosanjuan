// src/types/news.ts
export interface ImageDisplayOptions {
    size: 'small' | 'medium' | 'large' | 'full';
    alignment: 'left' | 'center' | 'right';
    caption?: string;
    cropMode: 'cover' | 'contain' | 'none';
  }
  
  export interface NewsImage {
    url: string;
    publicId?: string;
    displayOptions: ImageDisplayOptions;
  }
  
  export interface Section {
    images: NewsImage[];
    text: string;
    videoUrl?: string;
  }