'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { auth, User } from '@/lib/auth';
import { projectsAPI, getImageUrl } from '@/lib/api';
import { Project, Testimonial } from '@/types/project';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

import 'react-quill/dist/quill.snow.css';

export default function EditProject() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedExistingImages, setRemovedExistingImages] = useState<string[]>([]);
  const [testimonial, setTestimonial] = useState<Testimonial>({
    name: '',
    role: '',
    image: '',
    quote: ''
  });
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    client: '',
    year: new Date().getFullYear(),
    shortDescription: '',
    description: '',
    technologies: '',
    status: 'draft' as 'draft' | 'published',
    featured: false,
  });

  const checkAuth = useCallback(async () => {
    console.log('Edit page - Starting auth check');
    if (!auth.isAuthenticated()) {
      console.log('Edit page - Not authenticated, redirecting to login');
      router.push('/admin/login');
      return false;
    }

    try {
      const currentUser = await auth.getCurrentUser();
      console.log('Edit page - Current user:', currentUser);
      if (!currentUser || currentUser.role !== 'admin') {
        console.log('Edit page - User not admin, redirecting to login');
        router.push('/admin/login');
        return false;
      }
      setUser(currentUser);
      console.log('Edit page - Auth successful');
      return true;
    } catch (error) {
      console.error('Edit page - Auth error:', error);
      router.push('/admin/login');
      return false;
    }
  }, [router]);

  const fetchProject = useCallback(async () => {
    if (!projectId) {
      console.log('Edit page - No ID provided');
      return;
    }
    
    console.log('Edit page - Fetching project with ID:', projectId);
    try {
      const response = await projectsAPI.getProjectById(projectId);
      console.log('Edit page - Project response:', response.data);
      
      // The backend returns the project directly, not wrapped in a project property
      const project: Project = response.data;
      
      setFormData({
        title: project.title,
        category: project.category,
        client: project.client || '',
        year: project.year,
        shortDescription: project.shortDescription,
        description: project.description,
        technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : (project.technologies as string) || '',
        status: project.status,
        featured: project.featured,
      });
      
      // Load testimonial
      setTestimonial(project.testimonial || {
        name: '',
        role: '',
        image: '',
        quote: ''
      });
      
      // Extract URLs and IDs from ProjectImage objects
      const imageUrls = project.images?.map(img => img.url) || [];
      setExistingImages(imageUrls);
      console.log('Edit page - Project loaded successfully');
    } catch (error: any) {
      console.error('Edit page - Fetch project error:', error);
      
      // Don't redirect immediately, show error instead
      if (error.response?.status === 401) {
        console.log('Edit page - Unauthorized, redirecting to login');
        router.push('/admin/login');
      } else {
        toast.error('Failed to fetch project. Please try again.');
        // Don't redirect, let user stay on page
      }
    }
  }, [projectId, router]);

  useEffect(() => {
    const init = async () => {
      setInitialLoading(true);
      const isAuthenticated = await checkAuth();
      if (isAuthenticated && projectId) {
        await fetchProject();
      }
      setInitialLoading(false);
    };
    
    init();
  }, [checkAuth, fetchProject, projectId]);

  // Show loading state while initializing
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-soft-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images') {
          formDataToSend.append(key, value as string);
        }
      });

      // Append testimonial data
      formDataToSend.append('testimonial', JSON.stringify(testimonial));

      // Append remaining existing images
      existingImages.forEach((imageUrl) => {
        formDataToSend.append('existingImages', imageUrl);
      });

      // Append removed existing images
      removedExistingImages.forEach((imageUrl) => {
        formDataToSend.append('removedImages', imageUrl);
      });

      // Append new image files
      selectedFiles.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const response = await projectsAPI.updateProject(projectId, formDataToSend);
      console.log('Project updated successfully:', response);
      toast.success('Project updated successfully!');
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error('Project update error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update project';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Add new files to existing selection
    const updatedFiles = [...selectedFiles, ...files];
    setSelectedFiles(updatedFiles);

    // Create preview URLs for all files
    const previewUrls = updatedFiles.map(file => URL.createObjectURL(file));
    setImagePreview(previewUrls);
    
    // Clear the input value to allow selecting the same file again
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    
    // Update preview URLs
    const previewUrls = updatedFiles.map(file => URL.createObjectURL(file));
    setImagePreview(previewUrls);
  };

  const removeExistingImage = (index: number) => {
    const imageToRemove = existingImages[index];
    const updatedImages = existingImages.filter((_, i) => i !== index);
    
    setExistingImages(updatedImages);
    setRemovedExistingImages(prev => [...prev, imageToRemove]);
    toast.success('Image removed from selection');
  };

  const categories = ['Branding', 'Digital', 'Print', 'Art Direction', 'Web Design'];

  return (
    <div className="min-h-screen bg-soft-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif text-navy">Edit Project</h1>
          <button onClick={() => router.back()} className="text-gray-600 hover:text-navy">
            ← Back
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium text-navy">Project Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border px-4 py-3 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-navy">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border px-4 py-3 rounded-lg text-gray-900"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-navy">Short Description</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-lg text-gray-900"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-navy">Full Description</label>
              <div className="border border-gray-300 rounded-lg bg-white">
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                  placeholder="Write a detailed project description..."
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'color': [] }, { 'background': [] }],
                      ['link', 'image'],
                      ['clean']
                    ],
                  }}
                  style={{ height: '200px' }}
                  className="text-gray-900"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Use the toolbar above to format your description
              </p>
            </div>

            <div>
              <label className="block mb-2 font-medium text-navy">Technologies</label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-lg text-gray-900"
              />
            </div>

            {/* Testimonial Section */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-medium text-navy mb-4">Testimonial (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={testimonial.name}
                    onChange={(e) => setTestimonial(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper focus:border-transparent transition-colors text-gray-900"
                    placeholder="Client or reviewer name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Role/Company
                  </label>
                  <input
                    type="text"
                    value={testimonial.role}
                    onChange={(e) => setTestimonial(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper focus:border-transparent transition-colors text-gray-900"
                    placeholder="CEO, Company Name"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-navy mb-2">
                  Testimonial Quote
                </label>
                <textarea
                  value={testimonial.quote}
                  onChange={(e) => setTestimonial(prev => ({ ...prev, quote: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper focus:border-transparent transition-colors resize-none text-gray-900"
                  placeholder="What did they say about your work?"
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {testimonial.quote.length}/500 characters
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium text-navy">Client</label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  className="w-full border px-4 py-3 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-navy">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full border px-4 py-3 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-navy">Images ({selectedFiles.length} new selected)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper focus:border-transparent transition-colors"
              />
              <p className="text-sm text-gray-500 mt-1">
                Select new images to add to the existing ones. You can select multiple files or add them one by one.
              </p>
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-navy mb-3">Existing Images ({existingImages.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {existingImages.map((url, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <img
                          src={getImageUrl(url)}
                          alt={`Existing image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                          crossOrigin="anonymous"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          Existing
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* New Selected Images */}
              {imagePreview.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-navy mb-3">New Selected Images ({selectedFiles.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreview.map((url, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <img
                          src={url}
                          alt={`New image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {selectedFiles[index]?.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium text-navy">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border px-4 py-3 rounded-lg text-gray-900"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-copper border-gray-300 rounded"
                />
                <label className="ml-2 text-navy">Featured Project</label>
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-copper"
              >
                {loading ? 'Updating...' : 'Update Project'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}
