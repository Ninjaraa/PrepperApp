import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { InventoryItem } from '../types';
import { getInventory, setInventory } from '../utils/storage';

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id' | 'addedDate'>) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItemsState] = useState<InventoryItem[]>([]);

  useEffect(() => {
    setItemsState(getInventory());
  }, []);

  const addItem = (item: Omit<InventoryItem, 'id' | 'addedDate'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      addedDate: new Date(),
    };
    const newItems = [...items, newItem];
    setItemsState(newItems);
    setInventory(newItems);
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    setItemsState(newItems);
    setInventory(newItems);
  };

  const deleteItem = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
    setItemsState(newItems);
    setInventory(newItems);
  };

  return (
    <InventoryContext.Provider value={{ items, addItem, updateItem, deleteItem }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
