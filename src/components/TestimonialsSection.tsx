import { useState, useEffect } from 'react';
import { TESTIMONIALS } from '../data/clinicData';
import { Star, Quote, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

// 1. Endpoint de la API de Google Apps Script (Google Sheets)
const GOOGLE_SHEETS_API_URL =
  "https://script.google.com/macros/s/AKfycbyABHOrocmdWrIGMwkN6aBay3uXbNT039mtI4SMB9V-ueNNJpz7JkO4SD7g4hi_3Pq7Ow/exec";

// Estructura de testimonio según la API
export interface TestimonioItem {
  id: string | number;
  nombre: string;
  testimonio: string;
  tratamiento: string;
  imagen: string;
  estrellas: number;
  activo?: string;
  fecha?: string;
}

/**
 * Función para transformar las URLs de Google Drive del campo imagen:
 * Si la URL contiene "/file/d/ID/view", la convierte a "https://lh3.googleusercontent.com/d/ID"
 * para que la etiqueta <img> pueda renderizarla directamente.
 */
export function formatGoogleDriveImageUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const cleanUrl = url.trim();
  if (!cleanUrl) return '';

  // Si ya es un enlace directo de Google User Content
  if (cleanUrl.includes('lh3.googleusercontent.com/d/')) {
    return cleanUrl;
  }

  // Si contiene /file/d/ID/... (ej. /file/d/ID/view...)
  const fileIdMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
  }

  // Formato alternativo de Google Drive con parámetro id
  const queryIdMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryIdMatch && queryIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${queryIdMatch[1]}`;
  }

  return cleanUrl;
}

/**
 * Obtiene las iniciales del nombre para el avatar en caso de que no haya imagen o falle su carga
 */
function getInitials(name: string): string {
  if (!name) return 'AV';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Componente de Avatar para testimonios con soporte de imagen de Google Drive y fallback a iniciales
 */
function TestimonialAvatar({
  imageUrl,
  name,
  size = 'md',
}: {
  imageUrl?: string;
  name: string;
  size?: 'md' | 'lg';
}) {
  const [imgError, setImgError] = useState(false);
  const formattedUrl = formatGoogleDriveImageUrl(imageUrl);
  const initials = getInitials(name);
  const sizeClasses = size === 'lg' ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm';

  if (formattedUrl && !imgError) {
    return (
      <img
        src={formattedUrl}
        alt={name}
        onError={() => setImgError(true)}
        className={`${sizeClasses} rounded-full object-cover border border-[#D9E2C0] flex-shrink-0 shadow-2xs group-hover:border-[#56642B] transition-colors`}
        referrerPolicy="no-referrer"
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-[#FAF9F5] border border-[#D9E2C0] flex items-center justify-center font-serif font-bold text-[#56642B] flex-shrink-0 group-hover:border-[#56642B] transition-colors`}
    >
      {initials}
    </div>
  );
}

export default function TestimonialsSection() {
  const [historias, setHistorias] = useState<TestimonioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedReview, setSelectedReview] = useState<TestimonioItem | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchHistorias() {
      setLoading(true);

      try {
        const response = await fetch(GOOGLE_SHEETS_API_URL, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Error en respuesta HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Si la respuesta es un arreglo o viene encapsulada
        const rawList: any[] = Array.isArray(data)
          ? data
          : data?.data || data?.historias || data?.items || [];

        // Filtrar registros donde `activo` sea igual a "si" (ignorando mayúsculas/minúsculas)
        const activeItems = rawList.filter((item: any) => {
          if (!item) return false;
          // Si el campo activo existe, validar que sea "si"
          const activoVal = String(item.activo || '').trim().toLowerCase();
          return activoVal === 'si' || activoVal === 'sí' || item.activo === true;
        });

        // Mapear campos devueltos: id, nombre, testimonio, tratamiento, imagen, estrellas
        const parsedList: TestimonioItem[] = activeItems.map((item: any, idx: number) => ({
          id: item.id ?? `sheet-${idx}`,
          nombre: String(item.nombre || 'Paciente de la clínica').trim(),
          testimonio: String(item.testimonio || item.historia || item.quote || '').trim(),
          tratamiento: String(item.tratamiento || 'Tratamiento Integral').trim(),
          imagen: String(item.imagen || item.imagen_url || item.foto || '').trim(),
          estrellas: Math.min(5, Math.max(1, Number(item.estrellas || item.calificacion || 5))),
          activo: item.activo,
          fecha: item.fecha || 'Testimonio verificado',
        }));

        if (isMounted) {
          if (parsedList.length > 0) {
            setHistorias(parsedList);
          } else {
            // Si la hoja no tiene registros marcados con activo="si", usar respaldo
            setHistorias(
              TESTIMONIALS.map((t) => ({
                id: t.id,
                nombre: t.author,
                testimonio: t.quote,
                tratamiento: t.conditionTag,
                imagen: '',
                estrellas: t.rating,
                activo: 'si',
                fecha: t.date || 'Verificado',
              }))
            );
          }
          setLoading(false);
        }
      } catch (error) {
        console.warn('Aviso: Fallo al consultar API de Google Sheets, empleando testimonios de respaldo:', error);
        if (isMounted) {
          setHistorias(
            TESTIMONIALS.map((t) => ({
              id: t.id,
              nombre: t.author,
              testimonio: t.quote,
              tratamiento: t.conditionTag,
              imagen: '',
              estrellas: t.rating,
              activo: 'si',
              fecha: t.date || 'Verificado',
            }))
          );
          setLoading(false);
        }
      }
    }

    fetchHistorias();

    return () => {
      isMounted = false;
    };
  }, []);

  // Multiplicamos elementos para garantizar desplazamiento fluido infinito
  const marqueeItems =
    historias.length > 0
      ? historias.length < 5
        ? [...historias, ...historias, ...historias, ...historias]
        : [...historias, ...historias]
      : [];

  const handleScroll = (direction: 'left' | 'right') => {
    const track = document.getElementById('testimonials-marquee-track');
    if (track) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="historias" className="w-full py-16 sm:py-20 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D3618] tracking-tight">
            Historias de Sanación
          </h2>

          {/* Decorative olive underline */}
          <div className="w-12 h-0.5 bg-[#8A9A5B] mx-auto my-3 rounded-full" />

          <p className="font-sans text-sm sm:text-base text-[#46483C] leading-relaxed">
            Lo que nuestros pacientes dicen sobre su camino al bienestar.
          </p>

          {/* Controles de navegación del carrusel */}
          {!loading && historias.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4 text-xs">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="p-1.5 rounded-full border border-[#D9E2C0] bg-white text-[#56642B] hover:bg-[#F4F3EC] transition-colors cursor-pointer"
                aria-label="Desplazar a la izquierda"
                title="Desplazar a la izquierda"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="px-3 py-1 rounded-full border border-[#D9E2C0] bg-white text-[#56642B] hover:bg-[#F4F3EC] transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
                aria-label={isPaused ? 'Reanudar carrusel' : 'Pausar carrusel'}
              >
                {isPaused ? (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Reanudar</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 fill-current" />
                    <span>Pausar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="p-1.5 rounded-full border border-[#D9E2C0] bg-white text-[#56642B] hover:bg-[#F4F3EC] transition-colors cursor-pointer"
                aria-label="Desplazar a la derecha"
                title="Desplazar a la derecha"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Indicador visual / Skeleton mientras los datos se están cargando */}
      {loading ? (
        <div className="relative w-full overflow-hidden py-4">
          <div className="flex items-stretch gap-6 pl-6 overflow-hidden max-w-7xl mx-auto">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="w-[290px] sm:w-[350px] md:w-[380px] flex-shrink-0 bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E5D9] shadow-2xs animate-pulse flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#ECF0DE] flex-shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 bg-[#E7E5D9] rounded w-28" />
                      <div className="h-3 bg-[#F4F3EC] rounded w-16" />
                    </div>
                  </div>
                  <div className="h-5 bg-[#ECF0DE] rounded-full w-24 mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-[#F4F3EC] rounded w-full" />
                    <div className="h-3 bg-[#F4F3EC] rounded w-5/6" />
                    <div className="h-3 bg-[#F4F3EC] rounded w-4/6" />
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-[#F4F3EC] flex justify-between">
                  <div className="h-3 bg-[#F4F3EC] rounded w-16" />
                  <div className="h-3 bg-[#E7E5D9] rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Marquee Carousel Wrapper with Edge Gradient Masks */
        <div className="relative w-full overflow-hidden py-4 no-scrollbar">
          {/* Left & Right Soft Fade Masks */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#FAF9F5] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#FAF9F5] to-transparent z-10" />

          {/* Carrusel con iteración dinámica de testimonios */}
          <div
            className={`flex items-stretch gap-6 pl-6 cursor-grab active:cursor-grabbing ${
              isPaused ? 'overflow-x-auto no-scrollbar' : 'animate-marquee-slow'
            }`}
            id="testimonials-marquee-track"
          >
            {marqueeItems.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => setSelectedReview(item)}
                className="w-[290px] sm:w-[350px] md:w-[380px] flex-shrink-0 bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E5D9] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer hover:border-[#BDCF9A] select-none group"
                id={`testimonial-card-${item.id}-${idx}`}
              >
                <div>
                  {/* Header: Fotografía (imagen) o avatar de iniciales + Nombre (nombre) + Estrellas (estrellas) */}
                  <div className="flex items-center space-x-3 mb-3.5">
                    <TestimonialAvatar imageUrl={item.imagen} name={item.nombre} />
                    <div>
                      <h3 className="font-sans font-semibold text-sm text-[#2D3618]">
                        {item.nombre}
                      </h3>
                      <div className="flex items-center space-x-0.5 mt-0.5">
                        {[...Array(item.estrellas)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308]" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tratamiento (tratamiento) */}
                  <div className="mb-4">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-[#ECF0DE] border border-[#BDCF9A]/60 text-[#3E4C16] text-xs font-medium">
                      {item.tratamiento}
                    </span>
                  </div>

                  {/* Testimonio (testimonio) */}
                  <p className="font-sans text-xs sm:text-sm text-[#46483C] italic leading-relaxed font-normal line-clamp-4">
                    "{item.testimonio}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F4F3EC] flex items-center justify-between text-[11px] text-[#76786B]">
                  <span>{item.fecha || 'Verificado'}</span>
                  <span className="text-[#56642B] font-medium group-hover:underline">
                    Leer testimonio completo →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal para ver el testimonio completo */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-[#E7E5D9] relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-4 right-4 text-[#76786B] hover:text-[#2D3618] p-1 rounded-full hover:bg-[#F4F3EC] cursor-pointer"
              aria-label="Cerrar testimonio"
            >
              ✕
            </button>

            <div className="flex items-center space-x-3.5 mb-4">
              <TestimonialAvatar
                imageUrl={selectedReview.imagen}
                name={selectedReview.nombre}
                size="lg"
              />
              <div>
                <h3 className="font-serif font-bold text-lg text-[#2D3618]">
                  {selectedReview.nombre}
                </h3>
                <div className="flex items-center space-x-1 mt-0.5">
                  {[...Array(selectedReview.estrellas)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#EAB308] text-[#EAB308]" />
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#ECF0DE] text-[#3E4C16] text-xs font-semibold">
                {selectedReview.tratamiento}
              </span>
            </div>

            <div className="relative mb-6">
              <Quote className="w-8 h-8 text-[#BDCF9A]/40 absolute -top-3 -left-2 -z-10" />
              <p className="font-sans text-sm sm:text-base text-[#3A4033] leading-relaxed italic">
                "{selectedReview.testimonio}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F4F3EC]">
              <span className="text-xs text-[#76786B]">
                {selectedReview.fecha || 'Testimonio verificado'}
              </span>
              <button
                onClick={() => setSelectedReview(null)}
                className="px-5 py-2 rounded-lg bg-[#56642B] text-white text-xs font-semibold hover:bg-[#465322] transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}



