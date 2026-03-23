import { create } from 'zustand';

const MOCK_EVENTS = [
  {
    id: 'e1',
    title: 'Networking Brunch',
    description: 'A casual morning meetup for startup founders and investors to discuss new opportunities.',
    category: 'Networking',
    start: '2026-03-25T10:00:00',
    end: '2026-03-25T12:00:00',
    location: 'Cafe 42, Gurugram',
    status: 'published',
    speakers: [
      { id: 's1', name: 'Anish Raj', bio: 'Founder of TechVesta', image: 'https://i.pravatar.cc/150?u=anish' }
    ]
  },
  {
    id: 'e2',
    title: 'AI Workshop: LLM Basics',
    description: 'Learn the fundamentals of Large Language Models and how to integrate them into your apps.',
    category: 'Education',
    start: '2026-03-28T14:00:00',
    end: '2026-03-28T17:00:00',
    location: 'Main Hall, OfisSquare',
    status: 'draft',
    speakers: []
  }
];

const MOCK_RSVPS = [
  { id: 'r1', eventId: 'e1', name: 'Amit Sharma', email: 'amit@test.com', phone: '9876543210', company: 'Google', role: 'Engineer', client: 'Acme Corp' },
  { id: 'r2', eventId: 'e1', name: 'Sneha Kapur', email: 'sneha@test.com', phone: '9876543211', company: 'Zomato', role: 'Product Manager', client: 'Startup Inc' },
];

export const useEventsStore = create((set) => ({
  events: MOCK_EVENTS,
  rsvps: MOCK_RSVPS,

  addEvent: (event) => set((state) => ({ 
    events: [{ ...event, id: Math.random().toString(36).substr(2, 9) }, ...state.events] 
  })),

  updateEvent: (id, updatedEvent) => set((state) => ({
    events: state.events.map(e => e.id === id ? { ...updatedEvent, id } : e)
  })),

  deleteEvent: (id) => set((state) => ({
    events: state.events.filter(e => e.id !== id)
  })),

  getRSVPsForEvent: (eventId) => (state) => state.rsvps.filter(r => r.eventId === eventId),
}));
