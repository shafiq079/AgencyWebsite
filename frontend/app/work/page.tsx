'use client';

import Hero from '@/components/Hero';
import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { projectsAPI } from '@/lib/api';
import { Project } from '@/types/project';

export default function Work() {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectsRef, projectsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const categories = ['All', 'Branding', 'Digital', 'Print', 'Art Direction', 'Web Design'];

  useEffect(() => {
    fetchProjects();
  }, [filter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getProjects({
        category: filter === 'All' ? undefined : filter,
        limit: 20
      });
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Hero
        subtitle="Our Work"
        title="Creative Excellence in Action"
        description="Explore our portfolio of carefully crafted projects that showcase our commitment to exceptional design and creative innovation."
        height="large"
        backgroundImage="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
      />

      {/* Filter Section */}
      <section className="py-20 bg-soft-white">
        <div className="section-padding container-max">
          <AnimatedSection className="text-center">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${filter === category
                      ? 'bg-navy text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects Grid */}
      <section ref={projectsRef} className="pb-32 bg-soft-white">
        <div className="section-padding container-max">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                  <div className="w-full h-64 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-3"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={`${project._id}-${filter}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={projectsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/work/${project.slug}`}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                      <div className="relative overflow-hidden">
                        <img
                          src={project.featuredImage.startsWith('http')
                            ? project.featuredImage
                            : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${project.featuredImage}`
                          }
                          crossOrigin="anonymous"
                          alt={project.title}
                          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-white font-medium">View Project</span>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-navy">
                          {project.year}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-copper text-sm font-medium tracking-wider uppercase">
                            {project.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-serif text-navy mb-2 group-hover:text-copper transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {project.shortDescription}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No projects found for the selected category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-navy text-white">
        <div className="section-padding container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '150+', label: 'Projects Completed' },
              { number: '50+', label: 'Happy Clients' },
              { number: '15+', label: 'Awards Won' },
              { number: '6', label: 'Years Experience' },
            ].map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 0.1}>
                <div>
                  <div className="text-4xl md:text-5xl font-serif text-copper mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm">
                    {stat.label}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-warm-gray">
        <div className="section-padding container-max text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6 leading-tight">
              Let&apos;s create your next project together
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Ready to bring your vision to life? We&apos;d love to hear about your project
              and explore how we can help you achieve your goals.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-navy text-white px-8 py-4 rounded-full hover:bg-copper transition-colors font-medium text-lg"
            >
              Start Your Project
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}