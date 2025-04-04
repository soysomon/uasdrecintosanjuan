import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/uasdrecintosanjuan',
    icon: Facebook,
    color: '#1877F2'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/UASDSanJuan_',
    icon: Twitter,
    color: '#1DA1F2'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/channel/UCXk2XaQDLJlzZ3JYltFFP4Q',
    icon: Youtube,
    color: '#FF0000'
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/uasdsanjuan/',
    icon: Instagram,
    color: '#E4405F'
  }
];

export function SocialMediaSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-white">
      {/* Bauhaus-inspired geometric decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#2f2382]/5 transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2f2382]/5 transform translate-x-1/3 translate-y-1/3 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[#2f2382]/5 transform -translate-y-1/2 rotate-12" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">Síguenos en Redes Sociales</h2>
          <p className="mt-4 text-xl text-gray-600">
            Mantente conectado con nuestra comunidad universitaria
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50" />
              <div className="relative p-8">
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${social.color}15` }}
                >
                  <social.icon 
                    className="w-8 h-8 transition-colors duration-300"
                    style={{ color: social.color }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-center text-gray-900">
                  {social.name}
                </h3>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}