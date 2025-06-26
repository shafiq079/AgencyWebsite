'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { auth } from '@/lib/auth';
import { projectsAPI } from '@/lib/api';
import { ProjectFormData } from '@/types/project';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

export default function EditProject() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    shortDescription: '',
    category: 'Branding',
    technologies: '',
    client: '',
    year: new Date().getFullYear(),
    status: 'draft',
    featured: false,
    images: [],
  });

  useEffect(() => {
    checkAuth();
    fetchProject();
  }, []);

  const checkAuth = async () => {
    if (!auth.isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    try {
      const user = await auth.getCurrentUser();
      if (!user || user.role !== 'admin') router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  };

  const fetchProject = async () => {
    try {
      const { data } = await projectsAPI.getProjectById(id as string);
      console.log('Fetched project data:', data);
      setFormData({
        ...data,
        technologies: data.technologies.join(', '),
        images: [],
      });
      setImagePreview(data.images.map((img: any) => img.url));
    } catch {
      toast.error('Failed to load project');
      router.push('/admin/dashboard');
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const generatedSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const formDataToSend = new FormData();

    // Append all non-image fields
    Object.entries({ ...formData, slug: generatedSlug }).forEach(([key, value]) => {
      if (key !== 'images') {
        formDataToSend.append(key, value as string);
      }
    });

    // Append image files
    formData.images.forEach((image) => {
      formDataToSend.append('images', image);
    });

    await projectsAPI.updateProject(id as string, formDataToSend);
    toast.success('Project updated successfully');
    router.push('/admin/dashboard');
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Update failed');
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
    setFormData((prev) => ({ ...prev, images: files }));
    setImagePreview(files.map((file) => URL.createObjectURL(file)));
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
                  className="w-full border px-4 py-3 rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-navy">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border px-4 py-3 rounded-lg"
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
                className="w-full border px-4 py-3 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-navy">Full Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full border px-4 py-3 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-navy">Technologies</label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium text-navy">Client</label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  className="w-full border px-4 py-3 rounded-lg"
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
              <label className="block mb-2 font-medium text-navy">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              {imagePreview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {imagePreview.map((url, i) => (
                    <img key={i} src={url} className="w-full h-32 object-cover rounded-lg" />
                  ))}
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
                  className="w-full border px-4 py-3 rounded-lg"
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
