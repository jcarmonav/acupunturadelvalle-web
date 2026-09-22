export interface Service {
  id: string;
  title: string;
  subtitle?: string;
  badge: string;
  price: string;
  priceNumber: number;
  duration: string;
  durationMinutes: number;
  description: string;
  longDescription: string;
  iconName: 'leaf' | 'ear' | 'droplet' | 'hand' | 'flame' | 'sparkles';
  imageUrl: string;
  imageAlt: string;
  benefits: string[];
  indications: string[];
}

export interface ScheduleDay {
  day: string;
  hours: string;
  slots: string[];
}

export interface ClinicLocation {
  id: 'vina' | 'limache';
  name: string;
  typeLabel: string;
  address: string;
  city: string;
  yearBadge: string;
  imageUrl: string;
  imageAlt: string;
  googleMapsUrl: string;
  directions: string;
  googleCalendarHours: string;
  googleCalendarUrl?: string;
  schedules: ScheduleDay[];
  servicesAvailable: string[];
  buttonStyle: 'outline' | 'dark';
}

export interface Testimonial {
  id: string;
  author: string;
  initials: string;
  rating: number;
  conditionTag: string;
  quote: string;
  fullReview?: string;
  date?: string;
}

export interface HistoriaSanacion {
  id?: string;
  nombre: string;
  tratamiento: string;
  historia: string;
  imagen_url?: string;
  calificacion?: number;
  fecha?: string;
}

export interface BookingFormData {
  locationId: 'vina' | 'limache';
  serviceId: string;
  date: string;
  timeSlot: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  notes: string;
}
