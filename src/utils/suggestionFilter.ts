import type { Household, SuggestionItem, FilteredSuggestion, DietaryRestriction } from '../types';

type ImportSuggestions = { default: readonly SuggestionItem[] };

const INCOMPATIBLE_DIETARY_ITEMS: Record<DietaryRestriction, readonly string[]> = {
  Vegan: ['chicken', 'beef', 'pork', 'fish', 'tuna', 'eggs', 'dairy', 'meat'] as const,
  Vegetarian: ['chicken', 'beef', 'pork', 'fish', 'tuna', 'meat'] as const,
  GlutenFree: ['wheat', 'barley', 'rye', 'bread', 'pasta', 'oatmeal', 'crackers', 'granola', 'cereal', 'flour'] as const,
  DairyFree: ['milk', 'cheese', 'butter', 'cream', 'dairy', 'baby food'] as const,
  NutFree: ['peanut', 'almond', 'cashew', 'walnut', 'pecan', 'granola'] as const,
};

export async function getFilteredSuggestions(household: Household): Promise<FilteredSuggestion[]> {
  const filtered: FilteredSuggestion[] = [];

  const suggestionsModule = await import('../data/suggestions') as ImportSuggestions;
  const suggestions = suggestionsModule.default;

  suggestions.forEach((item: SuggestionItem) => {
    if (shouldShowItem(item, household)) {
      const quantity = calculateQuantity(item, household);
      if (quantity > 0) {
        filtered.push({ item, quantity });
      }
    }
  });

  return filtered.sort((a, b) => a.item.categoryPriority - b.item.categoryPriority);
}

function shouldShowItem(item: SuggestionItem, household: Household): boolean {
  const itemName = item.name.toLowerCase();

  if (household.dietaryRestrictions && household.dietaryRestrictions.length > 0) {
    for (const restriction of household.dietaryRestrictions) {
      const incompatibleItems = INCOMPATIBLE_DIETARY_ITEMS[restriction];
      if (incompatibleItems && incompatibleItems.some((incompatibleItem) => itemName.includes(incompatibleItem))) {
        return false;
      }
    }

    if (item.restrictions.requiresDietaryChoice) {
      if (!household.dietaryRestrictions.includes(item.restrictions.requiresDietaryChoice)) {
        return false;
      }
    }
  }

  if (household.allergies && household.allergies.length > 0) {
    for (const allergy of household.allergies) {
      if (item.restrictions.allergies.includes(allergy)) {
        return false;
      }
    }
  }

  return true;
}

function calculateQuantity(item: SuggestionItem, household: Household): number {
  let quantity = 0;

  switch (item.targetAudience) {
    case 'adult':
      quantity = item.baseQuantity * household.adults;
      break;
    case 'child':
      quantity = item.baseQuantity * household.children;
      break;
    case 'both':
      quantity = item.baseQuantity * (household.adults + household.children + household.pets);
      break;
  }

  return quantity;
}

export async function getCategorySuggestions(
  household: Household,
  category: string
): Promise<FilteredSuggestion[]> {
  const allSuggestions = await getFilteredSuggestions(household);
  return allSuggestions.filter((suggestion) => suggestion.item.category === category);
}

export async function getPrioritySuggestions(household: Household, priority: number): Promise<FilteredSuggestion[]> {
  const allSuggestions = await getFilteredSuggestions(household);
  return allSuggestions.filter((suggestion) => suggestion.item.categoryPriority === priority);
}
