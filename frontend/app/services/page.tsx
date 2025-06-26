'use client';

import Hero from '@/components/Hero';
import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Services() {
  const [servicesRef, servicesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const services = [
    {
      title: 'Brand Identity',
      description: 'Complete brand identity systems including logo design, typography, color palettes, and brand guidelines that create lasting impressions.',
      features: ['Logo Design', 'Brand Guidelines', 'Typography Systems', 'Color Palettes', 'Brand Applications'],
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
    },
    {
      title: 'Digital Design',
      description: 'User-centered digital experiences that combine beautiful aesthetics with intuitive functionality across all platforms.',
      features: ['Web Design', 'Mobile Apps', 'User Interface', 'User Experience', 'Prototyping'],
      image: 'https://images.pexels.com/photos/196655/pexels-photo-196655.jpeg',
    },
    {
      title: 'Art Direction',
      description: 'Creative leadership and visual storytelling that guides projects from concept to completion with artistic excellence.',
      features: ['Creative Strategy', 'Visual Storytelling', 'Photography Direction', 'Campaign Development', 'Creative Consulting'],
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
    },
    {
      title: 'Print Design',
      description: 'Sophisticated print materials that make tangible connections between your brand and audience through thoughtful design.',
      features: ['Editorial Design', 'Packaging', 'Marketing Materials', 'Stationery', 'Publication Design'],
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    },
  ];

  return (
    <>
      <Hero
        subtitle="Our Services"
        title="Comprehensive Design Solutions"
        description="We offer a full spectrum of design services to help your brand thrive in today's competitive landscape."
        height="large"
        backgroundImage="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
      />

      {/* Services Overview */}
      <section className="py-32 bg-soft-white">
        <div className="section-padding container-max">
          <AnimatedSection className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6 leading-tight">
              What We Offer
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From brand identity to digital experiences, we provide comprehensive design solutions 
              that help businesses connect with their audiences and achieve their goals.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Detailed Services */}
      <section ref={servicesRef} className="py-20 bg-white">
        <div className="section-padding container-max">
          <div className="space-y-32">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-serif text-navy mb-4">
                        {service.title}
                      </h3>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-navy mb-4">What's Included:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 text-copper mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-[400px] object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent rounded-lg" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 bg-navy text-white">
        <div className="section-padding container-max">
          <AnimatedSection className="text-center mb-20">
            <p className="text-copper text-sm font-medium tracking-wider uppercase mb-4">
              Our Approach
            </p>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              How We Deliver Excellence
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Our proven process ensures that every project is delivered on time, 
              on budget, and exceeds expectations.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Strategy',
                description: 'Understanding your goals, audience, and market to create a solid foundation.',
              },
              {
                step: '02',
                title: 'Concept',
                description: 'Developing creative concepts that align with your brand and objectives.',
              },
              {
                step: '03',
                title: 'Design',
                description: 'Crafting beautiful, functional designs with attention to every detail.',
              },
              {
                step: '04',
                title: 'Launch',
                description: 'Delivering polished results and providing ongoing support for success.',
              },
            ].map((phase, index) => (
              <AnimatedSection key={phase.step} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-4xl font-serif text-copper mb-4">
                    {phase.step}
                  </div>
                  <h3 className="text-xl font-serif mb-3">
                    {phase.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {phase.description}
                  </p>
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
              Ready to get started?
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Let's discuss your project and explore how we can help bring your vision to life.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center bg-navy text-white px-8 py-4 rounded-full hover:bg-copper transition-colors font-medium text-lg"
            >
              Start Your Project
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}