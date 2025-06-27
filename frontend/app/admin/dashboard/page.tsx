'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { auth, User } from '@/lib/auth';
import { projectsAPI, getImageUrl } from '@/lib/api';
import { Project } from '@/types/project';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
  });
  const router = useRouter();

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

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAllProjects({ limit: 10 });
      const projectsData = response.data.projects;
      console.log('Dashboard - Fetched projects:', projectsData);
      console.log('Dashboard - Sample project featuredImage:', projectsData[0]?.featuredImage);
      
      setProjects(projectsData);
      
      // Calculate stats
      setStats({
        total: projectsData.length,
        published: projectsData.filter((p: Project) => p.status === 'published').length,
        drafts: projectsData.filter((p: Project) => p.status === 'draft').length,
      });
    } catch (error) {
      console.error('Dashboard - Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      await fetchProjects();
    };
    init();
  }, [checkAuth, fetchProjects]);

  const handleLogout = async () => {
    await auth.logout();
    router.push('/admin/login');
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectsAPI.deleteProject(id);
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif text-navy">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.username}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-navy transition-colors"
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Projects</h3>
            <p className="text-3xl font-bold text-navy">{stats.total}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-2">Published</h3>
            <p className="text-3xl font-bold text-green-600">{stats.published}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-2">Drafts</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.drafts}</p>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-serif text-navy">Recent Projects</h2>
          <Link
            href="/admin/projects/new"
            className="bg-navy text-white px-6 py-2 rounded-lg hover:bg-copper transition-colors"
          >
            Add New Project
          </Link>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {project.featuredImage ? (
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={getImageUrl(project.featuredImage)}
                            alt={project.title}
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No img</span>
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {project.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {project.shortDescription.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-copper/10 text-copper">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/projects/edit/${project._id}`}
                          className="text-navy hover:text-copper"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteProject(project._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No projects found</p>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center bg-navy text-white px-6 py-3 rounded-lg hover:bg-copper transition-colors"
            >
              Create Your First Project
            </Link>
          </div>
        )}
      </div>
      
      <ToastContainer position="top-right" />
    </div>
  );
}