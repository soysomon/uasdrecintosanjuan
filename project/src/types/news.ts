export interface ImageDisplayOptions {
  size: 'small' | 'medium' | 'large' | 'full';
  alignment: 'left' | 'center' | 'right';
  caption?: string;
  cropMode: 'cover' | 'contain' | 'none';
}

export interface NewsImage {
  id: string;
  url: string;
  publicId?: string;
  displayOptions: ImageDisplayOptions;
}

export interface Pdf {
  url: string;
  publicId?: string;
}

export interface Section {
  id: string;
  images: NewsImage[];
  text: string;
  videoUrl?: string;
  pdf?: Pdf; // Added to support PDF uploads
}