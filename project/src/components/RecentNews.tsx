// src/components/RecentNews.tsx
// Redesign: editorial newspaper layout — Harvard Chan / UChicago style.
// Featured (left 7 cols): image top → large title + excerpt below (no overlay).
// Secondary stack (right 5 cols): bold title LEFT + small thumbnail RIGHT, thin dividers.
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';
import API_ROUTES from '../config/api';
import { getCache, setCache } from '../utils/apiCache';
import LazyImage from './LazyImage';

const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Types ────────────────────────────────────────────────────────── */
interface ImageDisplayOptions {
  size: 'small' | 'medium' | 'large' | 'full';
  alignment: 'left' | 'center' | 'right';
  caption?: string;
  cropMode: 'cover' | 'contain' | 'none';
}
interface NewsImage {
  id?: string;
  url: string;
  publicId?: string;
  displayOptions: ImageDisplayOptions;
}
interface Section {
  images: NewsImage[];
  text: string;
  imageUrl?: string;
  videoUrl?: string;
}
interface NewsItem {
  _id: string;
  title: string;
  sections: Section[];
  date: string;
  category: string;
}

/* ── Helpers ──────────────────────────────────────────────────────── */
function getYouTubeThumbnail(videoUrl: string): string {
  const match = videoUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : '';
}

function getImageUrl(section?: Section): string {
  if (!section) return '';
  if (section.images?.length) return section.images[0].url;
  if (section.imageUrl)       return section.imageUrl;
  if (section.videoUrl)       return getYouTubeThumbnail(section.videoUrl);
  return '';
}

function sectionHasVideo(section?: Section): boolean {
  return !!(section?.videoUrl && !section.images?.length && !section.imageUrl);
}

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('T')[0].split('-');
  return new Date(`${year}-${month}-${day}T12:00:00`).toLocaleDateString('es-DO', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

/* ── Skeleton ─────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-7 space-y-4">
        <div className="skeleton rounded" style={{ aspectRatio: '3/2', width: '100%' }} />
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-7 w-4/5 rounded" />
        <div className="skeleton h-7 w-3/5 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
      </div>
      <div className="lg:col-span-5">
        {[1, 2, 3, 4, 5, 6].map((k) => (
          <div key={k} className="flex items-start gap-4 py-4 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <div className="flex-1 space-y-2 pr-1">
              <div className="skeleton h-3 w-16 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-3/4 rounded" />
            </div>
            <div className="skeleton rounded flex-shrink-0" style={{ width: 84, height: 70 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Featured card — imagen arriba, texto abajo ───────────────────── */
function FeaturedCard({ item }: { item: NewsItem }) {
  const img  = getImageUrl(item.sections?.[0]);
  const date = formatDate(item.date);

  return (
    <Link
      to={`/noticias/${item._id}`}
      className="group block"
      aria-label={`Leer: ${item.title}`}
    >
      {/* ── Imagen con zoom al hover + blur-up reveal ── */}
      <div className="relative mb-5">
        <LazyImage
          src={img || '/placeholder-news.jpg'}
          alt={item.title}
          wrapperClassName="overflow-hidden rounded w-full"
          wrapperStyle={{ aspectRatio: '3/2' }}
          imgClassName="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.06]"
          priority
        />
        {sectionHasVideo(item.sections?.[0]) && (
          <span className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-black/60 text-white pointer-events-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </span>
        )}
      </div>

      {/* ── Categoría ── */}
      <span
        className="inline-block text-[10px] font-bold uppercase tracking-[0.16em]"
        style={{ color: 'var(--color-primary)' }}
      >
        {item.category}
      </span>

      {/* ── Título + underline animado ── */}
      <div className="mt-2">
        <h3
          className="font-extrabold leading-tight line-clamp-3"
          style={{
            fontSize:      'clamp(1.5rem, 2.6vw, 2.25rem)',
            color:         'var(--color-text-primary)',
            letterSpacing: '-0.028em',
            lineHeight:    '1.13',
          }}
        >
          {item.title}
        </h3>
        {/* Underline deslizante izq → der */}
        <span
          className="block mt-2 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
          style={{ height: '2px', backgroundColor: 'var(--color-text-primary)' }}
          aria-hidden="true"
        />
      </div>

      {/* ── Extracto ── */}
      {item.sections?.[0]?.text && (
        <p
          className="mt-3 line-clamp-3 leading-relaxed"
          style={{
            color:      'var(--color-text-muted)',
            fontSize:   '0.9375rem',
            lineHeight: '1.7',
          }}
        >
          {item.sections[0].text}
        </p>
      )}

      {/* ── Fecha ── */}
      <span
        className="inline-flex items-center gap-1.5 mt-4 text-xs"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <CalendarDays size={11} aria-hidden="true" />
        {date}
      </span>
    </Link>
  );
}

/* ── Secondary card — título izq + thumbnail der ─────────────────── */
function SecondaryCard({
  item,
  delay,
  isFirst,
}: {
  item: NewsItem;
  delay: number;
  isFirst?: boolean;
}) {
  const img = getImageUrl(item.sections?.[0]);

  return (
    <motion.div
      /* group en el wrapper → todos los group-hover: hijos se activan al hover aquí */
      className="relative overflow-hidden group"
      style={!isFirst ? { borderTop: '1px solid var(--color-border-subtle)' } : {}}
      initial={{ opacity: 0, x: 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: SPRING, delay }}
    >
      {/* ── Gold top-line: scale-x-0 → scale-x-100 desde izquierda ── */}
      <span
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none
                   origin-left scale-x-0 group-hover:scale-x-100
                   transition-transform duration-[250ms] ease-[cubic-bezier(0.25,0,0,1)]"
        style={{ height: '2px', backgroundColor: 'var(--color-accent)' }}
        aria-hidden="true"
      />

      {/* ── Shine sweep diagonal ── */}
      <span
        className="absolute top-0 bottom-0 z-10 pointer-events-none
                   -translate-x-full group-hover:translate-x-[350%]
                   transition-transform duration-500 ease-[cubic-bezier(0.25,0,0,1)]
                   skew-x-[-18deg]"
        style={{
          width: '35%',
          background:
            'linear-gradient(105deg, transparent 0%, rgba(253,185,19,0.11) 50%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <Link
        to={`/noticias/${item._id}`}
        className="flex items-center gap-4 py-4 relative z-20"
        aria-label={`Leer: ${item.title}`}
      >
        {/* ── Texto ── */}
        <div className="flex-1 min-w-0 pr-1">
          <span
            className="block text-[10px] font-bold uppercase tracking-[0.14em] mb-1"
            style={{ color: 'var(--color-primary)' }}
          >
            {item.category}
          </span>

          {/* Título + underline deslizante izq → der */}
          <div>
            <h4
              className="font-bold leading-snug line-clamp-2"
              style={{
                fontSize:      '0.9375rem',
                color:         'var(--color-text-primary)',
                letterSpacing: '-0.016em',
                lineHeight:    '1.38',
              }}
            >
              {item.title}
            </h4>
            <span
              className="block mt-1 origin-left scale-x-0 group-hover:scale-x-100
                         transition-transform duration-[280ms] ease-[cubic-bezier(0.25,0,0,1)]"
              style={{ height: '1.5px', backgroundColor: 'var(--color-primary)' }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* ── Thumbnail con zoom + lazy ── */}
        <div className="relative flex-shrink-0 overflow-hidden rounded" style={{ width: 108, height: 88 }}>
          {img ? (
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.06]"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))' }}
            />
          )}
          {sectionHasVideo(item.sections?.[0]) && (
            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-black/55 text-white">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </span>
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Section ──────────────────────────────────────────────────────── */
const RecentNews: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ── Cache hit: render instantly ──
    const cached = getCache<NewsItem[]>('news');
    if (cached) {
      const sorted = [...cached].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setNewsItems(sorted.slice(0, 7));
      setIsLoading(false);
      return;
    }
    // ── Network fetch ──
    axios
      .get(API_ROUTES.NEWS)
      .then(({ data }) => {
        setCache('news', data, 120_000); // 2 min TTL
        const sorted = [...data].sort(
          (a: NewsItem, b: NewsItem) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setNewsItems(sorted.slice(0, 7));
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section
      className="section-padding"
      style={{ backgroundColor: 'var(--color-surface)' }}
      aria-labelledby="recent-news-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header con thick bottom rule ── */}
        <div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10 pb-5"
          style={{ borderBottom: '2px solid var(--color-text-primary)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: SPRING }}
          >
            <p
              className="section-label mb-1.5"
              style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}
            >
              Sala de Prensa
            </p>
            <h2
              id="recent-news-heading"
              className="font-extrabold"
              style={{
                fontSize:      'clamp(2rem, 4vw, 2.75rem)',
                color:         'var(--color-text-primary)',
                letterSpacing: '-0.032em',
                lineHeight:    '1.06',
              }}
            >
              Noticias Recientes
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/noticias"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold
                         transition-all duration-200 group hover:gap-3"
              style={{ color: 'var(--color-primary)' }}
            >
              Ver todas las noticias
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        </div>

        {/* ── Content grid ── */}
        {isLoading ? (
          <Skeleton />
        ) : newsItems.length === 0 ? (
          <p
            className="text-center py-16 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            No hay noticias disponibles en este momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 xl:gap-16">

            {/* ── Featured — columna izquierda ── */}
            {newsItems[0] && (
              <motion.div
                className="lg:col-span-7 mb-10 lg:mb-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: SPRING }}
              >
                <FeaturedCard item={newsItems[0]} />
              </motion.div>
            )}

            {/* ── Secondary stack — columna derecha ── */}
            {newsItems.length > 1 && (
              <div className="lg:col-span-5 flex flex-col">
                {newsItems.slice(1, 7).map((item, i) => (
                  <SecondaryCard
                    key={item._id}
                    item={item}
                    delay={0.07 + i * 0.07}
                    isFirst={i === 0}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Mobile CTA ── */}
        <div className="mt-8 sm:hidden">
          <Link
            to="/noticias"
            className="flex items-center justify-center gap-2 w-full py-3.5 text-sm font-semibold
                       rounded-lg border-2 transition-all duration-200"
            style={{
              borderColor: 'var(--color-primary)',
              color:       'var(--color-primary)',
            }}
          >
            Ver todas las noticias
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default RecentNews;
