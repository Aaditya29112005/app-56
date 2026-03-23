import { create } from 'zustand';
import axios from 'axios';

// Mock Data
const MOCK_AREAS = [
  { id: 'ca1', name: 'Main Lobby', building: 'Sohna Road Gurugram', type: 'LOBBY', devices: ['Camera', 'Lights', 'AC'], status: 'ACTIVE', description: 'Primary entrance area with visitor seating.' },
  { id: 'ca2', name: 'Alpha Lounge', building: 'Sohna Road Gurugram', type: 'LOUNGE', devices: ['Speaker', 'AC', 'Lights'], status: 'ACTIVE', description: 'Breakout space for members.' },
  { id: 'ca3', name: 'Pantry West', building: 'Test - Gurugram', type: 'PANTRY', devices: ['Lights'], status: 'INACTIVE', description: 'Secondary pantry for block B.' },
  { id: 'ca4', name: 'Work Cafe', building: 'Ofis Test', type: 'CAFETERIA', devices: ['Camera', 'Speaker', 'AC'], status: 'ACTIVE', description: 'Cafeteria with high-speed wifi.' },
];

export const useCommonAreaStore = create((set, get) => ({
  areas: MOCK_AREAS,
  loading: false,
  error: null,

  fetchAreas: async () => {
    set({ loading: true });
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    set({ loading: false });
  },

  addArea: async (area) => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    const newArea = { ...area, id: Math.random().toString(36).substr(2, 9) };
    set(state => ({ areas: [newArea, ...state.areas], loading: false }));
    return newArea;
  },

  updateArea: async (id, updatedData) => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set(state => ({
      areas: state.areas.map(a => a.id === id ? { ...a, ...updatedData } : a),
      loading: false
    }));
  },

  deleteArea: async (id) => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set(state => ({
      areas: state.areas.filter(a => a.id !== id),
      loading: false
    }));
  },

  toggleStatus: async (id) => {
    const area = get().areas.find(a => a.id === id);
    if (!area) return;
    const newStatus = area.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await get().updateArea(id, { status: newStatus });
  }
}));
