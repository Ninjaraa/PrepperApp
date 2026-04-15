import type { Household, InventoryItem, CategoryScore, ScoreRecord, Category, Tier } from '../types';
import { CATEGORY_WEIGHTS, DAYS_OF_SUPPLY } from '../types';

export function calculateDailyTargets(household: Household): Record<Category, number> {
  return {
    Water: household.adults * 3 + household.children * 2 + household.pets * 0.5,
    Food: household.adults * 2000 + household.children * 1500,
    Medical: 1,
    Communication: 1,
    Gear: 1,
    Energy: 1,
    Skills: 10,
  };
}

export function calculateTargetSupply(household: Household): Record<Category, number> {
  const dailyTargets = calculateDailyTargets(household);
  const targets: Record<Category, number> = {} as Record<Category, number>;

  for (const [category, dailyTarget] of Object.entries(dailyTargets)) {
    targets[category as Category] = dailyTarget * DAYS_OF_SUPPLY;
  }

  return targets;
}

export function calculateCurrentSupply(inventory: InventoryItem[]): Record<Category, number> {
  const supply: Record<Category, number> = {
    Water: 0,
    Food: 0,
    Medical: 0,
    Communication: 0,
    Gear: 0,
    Energy: 0,
    Skills: 0,
  };

  for (const item of inventory) {
    supply[item.category] += item.quantity;
  }

  return supply;
}

export function calculateCategoryScores(
  household: Household,
  inventory: InventoryItem[]
): Record<Category, CategoryScore> {
  const targetSupply = calculateTargetSupply(household);
  const currentSupply = calculateCurrentSupply(inventory);
  const scores: Record<Category, CategoryScore> = {} as Record<Category, CategoryScore>;

  for (const category of Object.keys(CATEGORY_WEIGHTS) as Category[]) {
    const target = targetSupply[category];
    const current = currentSupply[category];
    const score = target > 0 ? Math.min(100, (current / target) * 100) : 0;

    scores[category] = {
      category,
      currentSupply: current,
      targetSupply: target,
      score,
    };
  }

  return scores;
}

export function calculateTotalScore(categoryScores: Record<Category, CategoryScore>): number {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [category, scoreData] of Object.entries(categoryScores)) {
    const weight = CATEGORY_WEIGHTS[category as Category];
    weightedSum += scoreData.score * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

export function calculateTier(score: number): Tier {
  if (score <= 20) return 'Unprepared';
  if (score <= 40) return 'Beginner';
  if (score <= 60) return 'Aware';
  if (score <= 80) return 'Prepared';
  return 'Survivalist';
}

export function calculateScore(
  household: Household,
  inventory: InventoryItem[]
): ScoreRecord {
  const categoryScores = calculateCategoryScores(household, inventory);
  const totalScore = calculateTotalScore(categoryScores);
  const tier = calculateTier(totalScore);

  return {
    date: new Date(),
    totalScore,
    tier,
    categoryScores,
  };
}

export function getItemsExpiringWithin(items: InventoryItem[], days: number): InventoryItem[] {
  const now = new Date();
  const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return items.filter(
    (item) => item.expiryDate && new Date(item.expiryDate) <= threshold && new Date(item.expiryDate) > now
  );
}
