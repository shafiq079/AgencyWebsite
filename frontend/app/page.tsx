'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Hero from '@/components/Hero';
import AnimatedSection from '@/components/AnimatedSection';
import Link from 'next/link';

export default function Home() {
  const [servicesRef, servicesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [workRef, workInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const services = [
    {
      title: 'Brand Identity',
      description: 'Crafting distinctive visual identities that resonate with your audience and stand the test of time.',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
    },
    {
      title: 'Digital Design',
      description: 'Creating immersive digital experiences that blend aesthetics with functionality.',
      image: 'https://images.pexels.com/photos/196655/pexels-photo-196655.jpeg',
    },
    {
      title: 'Art Direction',
      description: 'Guiding creative vision from concept to execution with meticulous attention to detail.',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
    },
  ];

  const projects = [
    {
      title: 'Ethereal Spaces',
      category: 'Architecture',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    },
    {
      title: 'Minimal Essence',
      category: 'Branding',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
    },
    {
      title: 'Digital Harmony',
      category: 'Web Design',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
    },
    {
      title: 'Artisan Craft',
      category: 'Identity',
      image: 'https://images.pexels.com/photos/196655/pexels-photo-196655.jpeg',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <Hero
        subtitle="Creative Design Studio"
        title="Where Vision Meets Craft"
        description="We create exceptional digital experiences through thoughtful design, innovative storytelling, and meticulous attention to detail."
      />

      {/* About Section */}
      <section className="py-32 bg-soft-white">
        <div className="section-padding container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="space-y-8">
                <div>
                  <p className="text-copper text-sm font-medium tracking-wider uppercase mb-4">
                    Our Philosophy
                  </p>
                  <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6 leading-tight">
                    Design is not just what it looks like — design is how it works
                  </h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We believe in the power of thoughtful design to transform businesses and 
                  create meaningful connections. Our approach combines strategic thinking 
                  with creative excellence to deliver solutions that are both beautiful and functional.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center text-navy hover:text-copper transition-colors font-medium"
                >
                  Learn more about us
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
                  alt="Design process"
                  className="w-full h-[500px] object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent rounded-lg" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-32 bg-white">
        <div className="section-padding container-max">
          <AnimatedSection className="text-center mb-20">
            <p className="text-copper text-sm font-medium tracking-wider uppercase mb-4">
              What We Do
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6 leading-tight">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer a comprehensive range of design services to help your brand 
              stand out in today's competitive landscape.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg mb-6">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-2xl font-serif text-navy mb-4 group-hover:text-copper transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section ref={workRef} className="py-32 bg-warm-gray">
        <div className="section-padding container-max">
          <AnimatedSection className="text-center mb-20">
            <p className="text-copper text-sm font-medium tracking-wider uppercase mb-4">
              Portfolio
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6 leading-tight">
              Featured Work
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A selection of our recent projects that showcase our commitment 
              to exceptional design and creative excellence.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={workInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-copper text-sm font-medium tracking-wider uppercase mb-2">
                      {project.category}
                    </p>
                    <h3 className="text-2xl font-serif">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatedSection className="text-center mt-16">
            <Link
              href="/work"
              className="inline-flex items-center bg-navy text-white px-8 py-4 rounded-full hover:bg-copper transition-colors font-medium"
            >
              View All Work
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-navy text-white">
        <div className="section-padding container-max text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Ready to create something extraordinary?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Let's collaborate to bring your vision to life with exceptional design 
              and creative excellence.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-copper text-white px-8 py-4 rounded-full hover:bg-opacity-90 transition-all font-medium text-lg"
            >
              Start a Project
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