'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  // Don't render footer for admin routes
  if (isAdminRoute) {
    return null;
  }

  return (
    <footer className="bg-navy text-soft-white">
      <div className="section-padding container-max">
        <div className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-serif mb-6 gradient-text">Atelier</h3>
                <p className="text-lg text-gray-300 max-w-md leading-relaxed">
                  Crafting exceptional digital experiences with meticulous attention to detail 
                  and innovative storytelling.
                </p>
              </motion.div>
            </div>

            {/* Navigation */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-lg font-medium mb-6 text-copper">Navigation</h4>
                <ul className="space-y-3">
                  {['Home', 'About', 'Services', 'Work', 'Contact'].map((item) => (
                    <li key={item}>
                      <Link
                        href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                        className="text-gray-300 hover:text-copper transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Contact */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-lg font-medium mb-6 text-copper">Connect</h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="mailto:hello@atelier.com"
                      className="text-gray-300 hover:text-copper transition-colors"
                    >
                      hello@atelier.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+1234567890"
                      className="text-gray-300 hover:text-copper transition-colors"
                    >
                      +1 (234) 567-890
                    </a>
                  </li>
                  <li className="pt-4">
                    <div className="flex space-x-4">
                      {['Instagram', 'Dribbble', 'Behance'].map((social) => (
                        <a
                          key={social}
                          href="#"
                          className="text-gray-300 hover:text-copper transition-colors text-sm"
                        >
                          {social}
                        </a>
                      ))}
                    </div>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="border-t border-gray-700 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
          >
            <p className="text-gray-400 text-sm">
              © {currentYear} Atelier. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-copper text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-copper text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;