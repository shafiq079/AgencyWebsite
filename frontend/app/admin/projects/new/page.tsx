'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { auth, User } from '@/lib/auth';
import { projectsAPI } from '@/lib/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function NewProject() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Branding',
    client: '',
    year: new Date().getFullYear(),
    shortDescription: '',
    description: '',
    technologies: '',
    status: 'draft',
    featured: false,
  });

  const checkAuth = useCallback(async () => {
    if (!auth.isAuthenticated()) {
      router.push('/admin/login');
      return;
    }

    try {
      const currentUser = await auth.getCurrentUser();
      if (!currentUser || currentUser.role !== 'admin') {
        router.push('/admin/login');
        return;
      }
      setUser(currentUser);
    } catch (error) {
      router.push('/admin/login');
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length < 3) {
      toast.error('Please upload at least 3 images');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images') {
          formDataToSend.append(key, value as string);
        }
      });

      // Append image files
      selectedFiles.forEach((file) => {
        formDataToSend.append('images', file);
      });

      await projectsAPI.createProject(formDataToSend);
      toast.success('Project created successfully');
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Creation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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

  const categories = ['Branding', 'Digital', 'Print', 'Art Direction', 'Web Design'];

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif text-navy">Create New Project</h1>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-navy transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-navy mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper focus:border-transparent transition-colors"
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-navy mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper focus:border-transparent transition-colors"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="client" className="block text-sm font-medium text-navy mb-2">
                  Client
                </label>
                <input
                  type="text"
                  id="client"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper focus:border-transparent transition-colors"
                  placeholder="Client name"
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-navy mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  required
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="shortDescription" className="block text-sm font-medium text-navy mb-2">
                Short Description *
              </label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                required
                rows={3}
                value={formData.shortDescription}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper focus:border-transparent transition-colors resize-none"
                placeholder="Brief description for project cards (max 200 characters)"
                maxLength={200}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.shortDescription.length}/200 characters
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-navy mb-2">
                Full Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={8}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper focus:border-transparent transition-colors resize-none"
                placeholder="Detailed project description..."
                maxLength={1000}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/1000 characters
              </p>
            </div>

            <div>
              <label htmlFor="technologies" className="block text-sm font-medium text-navy mb-2">
                Technologies Used
              </label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper focus:border-transparent transition-colors"
                placeholder="React, Node.js, MongoDB (comma-separated)"
              />
            </div>

            {/* Images */}
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-navy mb-2">
                Project Images * ({selectedFiles.length} selected)
              </label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper focus:border-transparent transition-colors"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload at least 3 high-quality images (JPEG, PNG, WebP). You can select multiple files or add them one by one.
              </p>
              
              {imagePreview.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-navy mb-3">Selected Images ({selectedFiles.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreview.map((url, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={url}
                          alt={`Preview ${index + 1}`}
                          width={300}
                          height={200}
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

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-navy mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper focus:border-transparent transition-colors"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-copper focus:ring-copper border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-navy">
                  Featured Project
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-copper transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
      
      <ToastContainer position="top-right" />
    </div>
  );
}