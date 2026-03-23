import { create } from 'zustand';

const MOCK_CABINS = [
  { id: '1001', cabinNo: 'Cabin 1001', building: 'Sohna Road Gurugram', type: 'Private', floor: '10', capacity: 30, status: 'Available', allocatedTo: null },
  { id: '1004', cabinNo: 'Cabin 1004', building: 'Sohna Road Gurugram', type: 'Private', floor: '10', capacity: 7, status: 'Occupied', allocatedTo: 'TechVesta Inc' },
  { id: '2001', cabinNo: 'Cabin 2001', building: 'Ofis Test', type: 'Shared', floor: '02', capacity: 12, status: 'Available', allocatedTo: null },
  { id: '2005', cabinNo: 'Cabin 2005', building: 'Ofis Test', type: 'Meeting Room', floor: '02', capacity: 8, status: 'Maintenance', allocatedTo: null },
  { id: '3001', cabinNo: 'Cabin 3001', building: 'Test Building', type: 'Conference Room', floor: '05', capacity: 20, status: 'Available', allocatedTo: null },
  { id: '1008', cabinNo: 'Cabin 1008', building: 'Sohna Road Gurugram', type: 'Private', floor: '10', capacity: 7, status: 'Available', allocatedTo: null },
];

export const useCabinStore = create((set) => ({
  cabins: MOCK_CABINS,
  
  updateCabinStatus: (id, status) => set((state) => ({
    cabins: state.cabins.map(c => c.id === id ? { ...c, status } : c)
  })),

  refreshCabins: () => {
    // Simulate refresh logic
    set((state) => ({ loading: true }));
    setTimeout(() => {
        set((state) => ({ loading: false }));
    }, 1500);
  }
}));
