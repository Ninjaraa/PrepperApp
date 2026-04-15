export type Category = 'Water' | 'Food' | 'Medical' | 'Communication' | 'Gear' | 'Energy' | 'Skills';

export type Tier = 'Unprepared' | 'Beginner' | 'Aware' | 'Prepared' | 'Survivalist';

export type DietaryRestriction =
  | 'Vegetarian'
  | 'Vegan'
  | 'GlutenFree'
  | 'DairyFree'
  | 'NutFree';

export type Allergy =
  | 'Nuts'
  | 'TreeNuts'
  | 'Shellfish'
  | 'Gluten'
  | 'Dairy'
  | 'Eggs'
  | 'Soy'
  | 'Fish'
  | 'ShellfishEggs'
  | 'Peanuts';

export interface Household {
  adults: number;
  children: number;
  pets: number;
  dietaryRestrictions?: DietaryRestriction[];
  allergies?: Allergy[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: string;
  expiryDate?: Date;
  addedDate: Date;
}

export interface CategoryTarget {
  weight: number;
  dailyTarget: (household: Household) => number;
  unit: string;
}

export interface CategoryScore {
  category: Category;
  currentSupply: number;
  targetSupply: number;
  score: number;
}

export interface ScoreRecord {
  date: Date;
  totalScore: number;
  tier: Tier;
  categoryScores: Record<Category, CategoryScore>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  tier: Tier;
  unlocked?: boolean;
  unlockedDate?: Date;
}

export interface ShoppingListItem {
  id: string;
  category: Category;
  name: string;
  quantityNeeded: number;
  unit: string;
  completed?: boolean;
}

export const CATEGORY_WEIGHTS: Record<Category, number> = {
  Water: 1.0,
  Food: 1.0,
  Medical: 0.8,
  Communication: 0.6,
  Gear: 0.5,
  Energy: 0.4,
  Skills: 0.3,
};

export const DAYS_OF_SUPPLY = 21;

export interface SuggestionItem {
  id: string;
  category: Category;
  name: string;
  baseQuantity: number;
  unit: string;
  targetAudience: 'adult' | 'child' | 'both';
  restrictions: {
    dietaryRestrictions: DietaryRestriction[];
    allergies: Allergy[];
    requiresDietaryChoice?: DietaryRestriction;
  };
  categoryPriority: number;
}

export interface FilteredSuggestion {
  item: SuggestionItem;
  quantity: number;
}
