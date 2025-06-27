'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import { projectsAPI, getImageUrl } from '@/lib/api';
import { Project } from '@/types/project';

export default function ProjectDetail() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.slug) {
      fetchProject(params.slug as string);
    }
  }, [params.slug]);

  const fetchProject = async (slug: string) => {
    try {
      setLoading(true);
      const response = await projectsAPI.getProject(slug);
      setProject(response.data.project);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Project not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-soft-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-navy mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">{error || "The project you are looking for does not exist."}</p>
          <Link
            href="/work"
            className="inline-flex items-center bg-navy text-white px-6 py-3 rounded-full hover:bg-copper transition-colors"
          >
            Back to Work
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <Image
              src={getImageUrl(project.featuredImage)}
              crossOrigin="anonymous"
              alt={project.title}
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-navy/20" />
        </div>

        <div className="relative z-10 text-center text-white section-padding container-max">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-copper text-sm md:text-base font-medium tracking-wider uppercase mb-4"
            >
              {project.category}
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-serif mb-6 leading-tight"
            >
              {project.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg md:text-xl max-w-2xl mx-auto text-gray-200 leading-relaxed"
            >
              {project.shortDescription}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-32 bg-white">
        <div className="section-padding container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Project Info */}
            <div className="lg:col-span-1">
              <AnimatedSection>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-navy mb-4">Project Details</h3>
                    <div className="space-y-4">
                      {project?.createdAt && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Client</dt>
                          <dd className="text-gray-900">Uploaded By: {project.createdBy?.username}</dd>
                          <dd className="text-gray-900">Contact: <a href={`mailto:${project.createdBy?.email}`} className="text-blue-600 underline">{project.createdBy?.email}</a></dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Year</dt>
                        <dd className="text-gray-900">{project.year}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Category</dt>
                        <dd className="text-gray-900">{project.category}</dd>
                      </div>
                    </div>
                  </div>

                  {project.technologies.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-navy mb-4">Technologies</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-copper/10 text-copper text-sm rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            </div>

            {/* Project Description */}
            <div className="lg:col-span-2">
              <AnimatedSection delay={0.2}>
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-3xl font-serif text-navy mb-6">About This Project</h2>
                  <div 
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Project Testimonial */}
      {project.testimonial && project.testimonial.name && project.testimonial.quote && (
        <section className="py-32 bg-soft-white">
          <div className="section-padding container-max">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6 leading-tight">
                Client Testimonial
              </h2>
            </AnimatedSection>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-copper/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-copper" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>
                  <blockquote className="text-xl md:text-2xl text-gray-700 italic leading-relaxed mb-6">
                    &ldquo;{project.testimonial.quote}&rdquo;
                  </blockquote>
                  <div>
                    <p className="text-lg font-semibold text-navy">{project.testimonial.name}</p>
                    {project.testimonial.role && (
                      <p className="text-gray-600">{project.testimonial.role}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Project Gallery */}
      {project.images && project.images.length > 0 && (
        <section className="py-32 bg-soft-white">
          <div className="section-padding container-max">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6 leading-tight">
                Project Gallery
              </h2>
            </AnimatedSection>

            <div className="mt-12">
              <h3 className="text-2xl font-bold text-navy mb-6">Project Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative overflow-hidden rounded-lg"
                  >
                    <Image
                      src={getImageUrl(image.url)}
                      crossOrigin="anonymous"
                      alt={image.alt || `${project.title} - Image ${index + 1}`}
                      width={400}
                      height={256}
                      className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Navigation */}
      <section className="py-16 bg-navy text-white">
        <div className="section-padding container-max">
          <div className="flex justify-between items-center">
            <Link
              href="/work"
              className="inline-flex items-center text-white hover:text-copper transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Work
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center bg-copper text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-colors"
            >
              Start Your Project
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}