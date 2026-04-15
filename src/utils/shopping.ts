import type { Household, InventoryItem, ShoppingListItem, Category } from '../types';
import { calculateTargetSupply, calculateCurrentSupply } from './scoring';

export function generateShoppingList(
  household: Household,
  inventory: InventoryItem[]
): ShoppingListItem[] {
  const targetSupply = calculateTargetSupply(household);
  const currentSupply = calculateCurrentSupply(inventory);
  const shoppingList: ShoppingListItem[] = [];

  const categoryUnits: Record<Category, string> = {
    Water: 'L',
    Food: 'kcal',
    Medical: 'kits',
    Communication: 'devices',
    Gear: 'items',
    Energy: 'items',
    Skills: 'hours',
  };

  const categoryNames: Record<Category, string> = {
    Water: 'Water Supply',
    Food: 'Food Supply',
    Medical: 'Medical Kit',
    Communication: 'Communication Device',
    Gear: 'Emergency Gear',
    Energy: 'Energy Source',
    Skills: 'Training Hours',
  };

  for (const category of Object.keys(targetSupply) as Category[]) {
    const target = targetSupply[category];
    const current = currentSupply[category];
    const deficit = Math.max(0, target - current);

    if (deficit > 0) {
      shoppingList.push({
        id: `${category}-${Date.now()}`,
        category,
        name: categoryNames[category],
        quantityNeeded: deficit,
        unit: categoryUnits[category],
        completed: false,
      });
    }
  }

  return shoppingList;
}
