import { create } from 'zustand';

const MOCK_ROOMS = [
  { id: 'r1', name: 'Meeting Room 18', floor: '10th', building: 'Sohna Road Gurugram', capacity: 10, hourlyRate: 1800, status: 'active' },
  { id: 'r2', name: 'Executive Suite 01', floor: '12th', building: 'Sohna Road Gurugram', capacity: 12, hourlyRate: 2200, status: 'active' },
  { id: 'r3', name: 'Conference Hall', floor: '05th', building: 'Sector 44 Tower', capacity: 30, hourlyRate: 8500, status: 'inactive' },
  { id: 'r4', name: 'Collaboration Pod', floor: '08th', building: 'Cyber City Hub', capacity: 4, hourlyRate: 1200, status: 'active' },
];

const MOCK_BOOKINGS = [
  {
    id: 'b1',
    room: 'Meeting Room 1',
    capacity: 4,
    member: 'Ritik Kansal',
    company: 'GTW',
    building: 'Sohna Road, Gurugram',
    start: '2026-03-20T09:00:00',
    end: '2026-03-20T16:00:00',
    status: 'booked',
    invoiceStatus: 'paid',
    visitors: [
      { id: 'v1', name: 'John Doe', email: 'john@gtw.com', status: 'invited' }
    ]
  },
  {
    id: 'b2',
    room: 'Meeting Room 2',
    capacity: 4,
    member: 'Nasir Ansari',
    company: 'Ofis',
    building: 'Empire State, NYC',
    start: '2026-03-21T10:00:00',
    end: '2026-03-21T11:00:00',
    status: 'completed',
    invoiceStatus: 'pending',
    visitors: []
  }
];

export const useMeetingRoomStore = create((set) => ({
  bookings: MOCK_BOOKINGS,
  rooms: MOCK_ROOMS,
  discountCap: 2, // 2% default cap

  addBooking: (booking) => set((state) => ({ 
    bookings: [booking, ...state.bookings] 
  })),

  cancelBooking: (id) => set((state) => ({
    bookings: state.bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b)
  })),

  updateVisitorStatus: (bookingId, visitorId, status) => set((state) => ({
    bookings: state.bookings.map(b => b.id === bookingId ? {
      ...b,
      visitors: b.visitors.map(v => v.id === visitorId ? { ...v, status } : v)
    } : b)
  })),

  giveAccessToAll: (bookingId) => set((state) => ({
    bookings: state.bookings.map(b => b.id === bookingId ? {
      ...b,
      visitors: b.visitors.map(v => ({ ...v, status: 'checked_in' }))
    } : b)
  })),

  addVisitor: (bookingId, visitor) => set((state) => ({
    bookings: state.bookings.map(b => b.id === bookingId ? {
      ...b,
      visitors: [...b.visitors, { ...visitor, id: Math.random().toString(36).substr(2, 9), status: 'invited' }]
    } : b)
  })),
}));
