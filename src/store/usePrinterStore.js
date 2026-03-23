import { create } from 'zustand';

const MOCK_BUILDINGS = [
  { label: 'All Buildings', value: null },
  { label: 'OfisSquare Main', value: 'OfisSquare Main' },
  { label: 'Cyber City Hub', value: 'Cyber City Hub' },
  { label: 'Sector 44 Tower', value: 'Sector 44 Tower' },
];

const MOCK_REQUESTS = [
  {
    id: 'p1',
    fileName: 'Legal_Contract_v2.pdf',
    clientName: 'Rahul Verma',
    building: 'OfisSquare Main',
    status: 'pending',
    credits: 15,
    requestedDate: '2026-03-20T14:30:00',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 'p2',
    fileName: 'Marketing_Pitch_Deck.png',
    clientName: 'Sarah Jones',
    building: 'Cyber City Hub',
    status: 'ready',
    credits: 5,
    requestedDate: '2026-03-20T12:00:00',
    fileUrl: 'https://picsum.photos/800/600'
  },
  {
    id: 'p3',
    fileName: 'Invoice_MARCH_2026.pdf',
    clientName: 'TechVesta Inc',
    building: 'OfisSquare Main',
    status: 'completed',
    credits: 10,
    requestedDate: '2026-03-19T16:45:00',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  }
];

export const usePrinterStore = create((set) => ({
  requests: MOCK_REQUESTS,
  buildings: MOCK_BUILDINGS,

  addRequest: (request) => set((state) => ({
    requests: [{ ...request, id: Math.random().toString(36).substr(2, 9) }, ...state.requests]
  })),

  updateStatus: (id, newStatus) => set((state) => ({
    requests: state.requests.map(r => r.id === id ? { ...r, status: newStatus } : r)
  })),

  deleteRequest: (id) => set((state) => ({
    requests: state.requests.filter(r => r.id !== id)
  })),
}));
