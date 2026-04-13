/* EventIQ Global Styles */
export const C = {
  bg: '#05060f',
  bg2: '#0a0c1c',
  bg3: '#0f1221',
  surface: '#131629',
  border: 'rgba(99,102,241,0.15)',
  border2: 'rgba(255,255,255,0.06)',
  accent: '#6366f1',
  accent2: '#8b5cf6',
  accent3: '#06b6d4',
  green: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
  text: '#f0f4ff',
  muted: '#64748b',
  muted2: '#94a3b8',
};

export const API = process.env.REACT_APP_API_URL || 'https://eventiq-backend.onrender.com';

export const venues = [
  { id: 1, name: 'Marina Bay Sands Expo', city: 'Singapore', country: 'Singapore', lat: 1.2834, lng: 103.8607, type: 'Convention Center', capacity: 5000, price: 8000, rating: 4.8, reviews: 342, views: 12400, image: '🏛️', amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment', 'Security'], description: 'World-class convention center at Marina Bay with stunning views and state-of-the-art facilities.' },
  { id: 2, name: 'Chennai Trade Centre', city: 'Chennai', country: 'India', lat: 13.0474, lng: 80.2105, type: 'Trade Center', capacity: 3000, price: 2500, rating: 4.5, reviews: 218, views: 8900, image: '🏢', amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment'], description: 'Premier trade and exhibition center in the heart of Chennai.' },
  { id: 3, name: 'ExCeL London', city: 'London', country: 'UK', lat: 51.5074, lng: 0.0324, type: 'Exhibition Hall', capacity: 10000, price: 15000, rating: 4.7, reviews: 589, views: 23100, image: '🏟️', amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment', 'Security', 'Hotels nearby'], description: 'London\'s leading international venue with over 90,000 sq metres of flexible event space.' },
  { id: 4, name: 'Dubai World Trade Centre', city: 'Dubai', country: 'UAE', lat: 25.2285, lng: 55.2849, type: 'Convention Center', capacity: 8000, price: 12000, rating: 4.9, reviews: 467, views: 19800, image: '🕌', amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment', 'Security', 'Concierge'], description: 'Middle East\'s most prestigious event venue at the center of global business.' },
  { id: 5, name: 'Javits Center', city: 'New York', country: 'USA', lat: 40.7573, lng: -74.0021, type: 'Convention Center', capacity: 12000, price: 20000, rating: 4.6, reviews: 712, views: 31200, image: '🗽', amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment', 'Security', 'Rooftop'], description: 'New York\'s premier convention center on the Hudson River.' },
  { id: 6, name: 'Pragati Maidan', city: 'New Delhi', country: 'India', lat: 28.6129, lng: 77.2436, type: 'Exhibition Hall', capacity: 15000, price: 3000, rating: 4.3, reviews: 298, views: 11600, image: '🏛️', amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment'], description: 'India\'s largest exhibition and convention complex in New Delhi.' },
  { id: 7, name: 'Tokyo Big Sight', city: 'Tokyo', country: 'Japan', lat: 35.6329, lng: 139.7949, type: 'Exhibition Hall', capacity: 20000, price: 18000, rating: 4.8, reviews: 534, views: 27300, image: '⛩️', amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment', 'Security'], description: 'Japan\'s largest convention complex, famous for its unique inverted pyramid structure.' },
  { id: 8, name: 'Palais des Congrès', city: 'Paris', country: 'France', lat: 48.8985, lng: 2.2837, type: 'Convention Center', capacity: 4000, price: 11000, rating: 4.7, reviews: 389, views: 16700, image: '🗼', amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment', 'Security', 'Translation'], description: 'Iconic Paris convention center near the Arc de Triomphe.' },
  { id: 9, name: 'ICC Sydney', city: 'Sydney', country: 'Australia', lat: -33.8748, lng: 151.1989, type: 'Convention Center', capacity: 8000, price: 13000, rating: 4.8, reviews: 423, views: 18900, image: '🦘', amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment', 'Security', 'Harbour views'], description: 'Australia\'s premier convention center overlooking Darling Harbour.' },
  { id: 10, name: 'CTICC Cape Town', city: 'Cape Town', country: 'South Africa', lat: -33.9174, lng: 18.4204, type: 'Convention Center', capacity: 3500, price: 5000, rating: 4.6, reviews: 267, views: 9800, image: '🌍', amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment'], description: 'Cape Town International Convention Centre with Table Mountain views.' },
  { id: 11, name: 'Bombay Exhibition Centre', city: 'Mumbai', country: 'India', lat: 19.1197, lng: 72.8468, type: 'Exhibition Hall', capacity: 6000, price: 2800, rating: 4.4, reviews: 201, views: 8200, image: '🎭', amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment'], description: 'Mumbai\'s largest exhibition and trade fair venue in Goregaon.' },
  { id: 12, name: 'Feria de Madrid IFEMA', city: 'Madrid', country: 'Spain', lat: 40.4696, lng: -3.6082, type: 'Exhibition Hall', capacity: 18000, price: 14000, rating: 4.5, reviews: 512, views: 21400, image: '🇪🇸', amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment', 'Security', 'Hotels nearby'], description: 'Spain\'s international trade fair institution, one of Europe\'s largest.' },
];

export function wakeBackend() {
  fetch(`${API}/`).catch(() => {});
}

export const eventTypes = ['Conference', 'Wedding', 'Corporate', 'Concert', 'Exhibition', 'Workshop', 'Gala Dinner', 'Sports Event', 'Festival', 'Product Launch'];
