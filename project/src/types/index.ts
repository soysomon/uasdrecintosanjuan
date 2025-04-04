export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

export interface Faculty {
  id: string;
  name: string;
  title: string;
  department: string;
  imageUrl: string;
  email: string;
}

export interface ServiceLink {
  id: string;
  label: string;
  href: string;
  description: string;
}

export interface TechnicalCareer {
  id: string;
  title: string;
  duration: string;
  credits: number;
  imageUrl: string;
  isNew?: boolean;
  description?: string;
  location?: string;
  modality?: string;
  facultyId: string;
}

export interface FacultyFilter {
  id: string;
  name: string;
  color: string;
  description: string;
}