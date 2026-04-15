import { createContext, useContext, useState, type ReactNode } from "react";
import type { Category } from "../types";

export interface ShoppingListItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: string;
  checked: boolean;
}

interface ShoppingContextType {
  shoppingItems: ShoppingListItem[];
  addShoppingItem: (item: Omit<ShoppingListItem, "id" | "checked">) => void;
  removeShoppingItem: (id: string) => void;
  toggleShoppingItem: (id: string) => void;
  clearShoppingItems: () => void;
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(
  undefined,
);

export function ShoppingProvider({ children }: { children: ReactNode }) {
  const [shoppingItems, setShoppingItems] = useState<ShoppingListItem[]>([]);

  const addShoppingItem = (item: Omit<ShoppingListItem, "id" | "checked">) => {
    const isDuplicate = shoppingItems.some(
      (i) => i.name === item.name && i.category === item.category,
    );
    if (isDuplicate) return;

    setShoppingItems((prev) => [
      ...prev,
      { ...item, id: crypto.randomUUID(), checked: false },
    ]);
  };

  const removeShoppingItem = (id: string) => {
    setShoppingItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
    );
  };

  const clearShoppingItems = () => setShoppingItems([]);

  return (
    <ShoppingContext.Provider
      value={{
        shoppingItems,
        addShoppingItem,
        removeShoppingItem,
        toggleShoppingItem,
        clearShoppingItems,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
}

export function useShoppingList() {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error("useShoppingList must be used within a ShoppingProvider");
  }
  return context;
}
