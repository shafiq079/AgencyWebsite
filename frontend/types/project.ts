export interface ProjectImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface Testimonial {
  name: string;
  role: string;
  image?: string;
  quote: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: 'Branding' | 'Digital' | 'Print' | 'Art Direction' | 'Web Design';
  technologies: string[];
  images: ProjectImage[];
  featuredImage: string;
  client?: string;
  year: number;
  status: 'draft' | 'published';
  featured: boolean;
  testimonial?: Testimonial;
  createdBy?: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  technologies: string;
  client: string;
  year: number;
  status: 'draft' | 'published';
  featured: boolean;
  images: File[];
  testimonial?: Testimonial;
}