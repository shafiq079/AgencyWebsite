'use client';

import Hero from '@/components/Hero';
import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function About() {
  const [valuesRef, valuesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const values = [
    {
      title: 'Excellence',
      description: 'We pursue perfection in every detail, ensuring that our work exceeds expectations and stands the test of time.',
    },
    {
      title: 'Innovation',
      description: 'We embrace new technologies and creative approaches to solve complex design challenges.',
    },
    {
      title: 'Collaboration',
      description: 'We believe the best results come from working closely with our clients as true partners.',
    },
    {
      title: 'Authenticity',
      description: 'We create designs that are true to your brand and resonate with your audience.',
    },
  ];

  return (
    <>
      <Hero
        subtitle="About Us"
        title="Crafting Stories Through Design"
        description="We are a collective of designers, strategists, and storytellers passionate about creating meaningful experiences."
        height="large"
        backgroundImage="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
      />

      {/* Story Section */}
      <section className="py-32 bg-soft-white">
        <div className="section-padding container-max">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-navy mb-8 leading-tight">
                Our Story
              </h2>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <AnimatedSection>
                <div className="space-y-6">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Founded in 2018, Atelier emerged from a simple belief: that exceptional design 
                    has the power to transform businesses and create lasting connections between 
                    brands and their audiences.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    What started as a small studio has grown into a creative collective of passionate 
                    designers, strategists, and storytellers who share a commitment to excellence 
                    and innovation.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Today, we work with forward-thinking brands around the world, helping them 
                    navigate the complex landscape of modern design while staying true to their 
                    unique identity and values.
                  </p>
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={0.2}>
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                    alt="Our studio"
                    className="w-full h-[400px] object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent rounded-lg" />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-32 bg-white">
        <div className="section-padding container-max">
          <AnimatedSection className="text-center mb-20">
            <p className="text-copper text-sm font-medium tracking-wider uppercase mb-4">
              Our Values
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6 leading-tight">
              What Drives Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our core values guide every decision we make and every project we undertake.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-2xl font-serif text-navy mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-32 bg-navy text-white">
        <div className="section-padding container-max">
          <AnimatedSection className="text-center max-w-4xl mx-auto">
            <blockquote className="text-3xl md:text-4xl font-serif leading-relaxed mb-8">
               &quot;Design is not just what it looks like and feels like. Design is how it works.&quot;
            </blockquote>
            <cite className="text-copper text-lg font-medium">— Steve Jobs</cite>
          </AnimatedSection>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 bg-warm-gray">
        <div className="section-padding container-max">
          <AnimatedSection className="text-center mb-20">
            <p className="text-copper text-sm font-medium tracking-wider uppercase mb-4">
              Our Process
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6 leading-tight">
              How We Work
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Discover',
                description: 'We begin by understanding your brand, goals, and challenges through in-depth research and collaboration.',
              },
              {
                step: '02',
                title: 'Design',
                description: 'Our team crafts thoughtful solutions that balance creativity with strategic thinking and user needs.',
              },
              {
                step: '03',
                title: 'Deliver',
                description: 'We bring your vision to life with meticulous attention to detail and ongoing support.',
              },
            ].map((phase, index) => (
              <AnimatedSection key={phase.step} delay={index * 0.2}>
                <div className="text-center">
                  <div className="text-6xl font-serif text-copper mb-6">
                    {phase.step}
                  </div>
                  <h3 className="text-2xl font-serif text-navy mb-4">
                    {phase.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}