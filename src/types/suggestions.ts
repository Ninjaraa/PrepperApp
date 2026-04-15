import type { Category, DietaryRestriction, Allergy } from './index';

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
