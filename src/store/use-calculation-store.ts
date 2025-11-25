import { CalculationData, CostItem } from "@/schemas/nebenkosten-schema";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const initialCostItem: CostItem = {
  id: "",
  name: "",
  amount: 0,
  distributionType: "AREA",
};

const initialState: CalculationData = {
  landlord: {
    name: "",
    street: "",
    zip: "",
    city: "",
    email: "",
    phone: "",
    iban: "",
    bankName: "",
    bic: "",
  },
  billingPeriod: {
    from: new Date(new Date().getFullYear() - 1, 0, 1),
    to: new Date(new Date().getFullYear() - 1, 11, 31),
  },
  usagePeriod: {
    from: new Date(new Date().getFullYear() - 1, 0, 1),
    to: new Date(new Date().getFullYear() - 1, 11, 31),
  },
  property: {
    street: "",
    zip: "",
    city: "",
    totalArea: 0,
    totalUnits: 0,
    totalPersons: 0,
  },
  tenant: {
    name: "",
    currentArea: 0,
    persons: 0,
    prepayments: 0,
  },
  items: [],
};

interface CalculationState {
  data: CalculationData;

  setData: (data: Partial<CalculationData>) => void;
  updateProperty: (property: Partial<CalculationData["property"]>) => void;
  updateTenant: (tenant: Partial<CalculationData["tenant"]>) => void;

  addCostItem: () => void;
  removeCostItem: (id: string) => void;
  updateCostItem: (id: string, item: Partial<CostItem>) => void;

  updateLandlord: (landlord: Partial<CalculationData["landlord"]>) => void;

  reset: () => void;
}

export const useCalculationStore = create<CalculationState>()(
  persist(
    (set) => ({
      data: initialState,

      setData: (newData) =>
        set((state) => ({ data: { ...state.data, ...newData } })),

      updateProperty: (propData) =>
        set((state) => ({
          data: {
            ...state.data,
            property: { ...state.data.property, ...propData },
          },
        })),

      updateTenant: (tenantData) =>
        set((state) => ({
          data: {
            ...state.data,
            tenant: { ...state.data.tenant, ...tenantData },
          },
        })),

      addCostItem: () =>
        set((state) => ({
          data: {
            ...state.data,
            items: [
              ...state.data.items,
              {
                ...initialCostItem,
                id: crypto.randomUUID(),
              },
            ],
          },
        })),

      removeCostItem: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            items: state.data.items.filter((item) => item.id !== id),
          },
        })),

      updateCostItem: (id, updatedItem) =>
        set((state) => ({
          data: {
            ...state.data,
            items: state.data.items.map((item) =>
              item.id === id ? { ...item, ...updatedItem } : item
            ),
          },
        })),

      updateLandlord: (landlordData) =>
        set((state) => ({
          data: {
            ...state.data,
            landlord: { ...state.data.landlord, ...landlordData },
          },
        })),

      reset: () => set({ data: initialState }),
    }),
    {
      name: "nebenkosten-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
