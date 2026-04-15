import type { Household, InventoryItem, ScoreRecord, Achievement, DietaryRestriction, Allergy } from '../types';

type StoredInventoryItem = Omit<InventoryItem, 'addedDate' | 'expiryDate'> & {
  addedDate: string;
  expiryDate?: string;
};

type StoredScoreRecord = Omit<ScoreRecord, 'date'> & {
  date: string;
};

type StoredAchievement = Omit<Achievement, 'unlockedDate'> & {
  unlockedDate?: string;
};

type StoredHousehold = {
  adults: number;
  children: number;
  pets: number;
  dietaryRestrictions?: DietaryRestriction[];
  allergies?: Allergy[];
};

const STORAGE_KEYS = {
  HOUSEHOLD: 'prepperapp_household',
  INVENTORY: 'prepperapp_inventory',
  SCORE_HISTORY: 'prepperapp_score_history',
  ACHIEVEMENTS: 'prepperapp_achievements',
} as const;

export function getHousehold(): Household {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HOUSEHOLD);
    if (!data) {
      return { adults: 0, children: 0, pets: 0 };
    }

    const parsed: StoredHousehold = JSON.parse(data);

    return {
      adults: parsed.adults || 0,
      children: parsed.children || 0,
      pets: parsed.pets || 0,
      dietaryRestrictions: parsed.dietaryRestrictions || [],
      allergies: parsed.allergies || [],
    };
  } catch {
    return { adults: 0, children: 0, pets: 0 };
  }
}

export function setHousehold(household: Household): void {
  const storedHousehold: StoredHousehold = {
    adults: household.adults,
    children: household.children,
    pets: household.pets,
    dietaryRestrictions: household.dietaryRestrictions || [],
    allergies: household.allergies || [],
  };

  localStorage.setItem(STORAGE_KEYS.HOUSEHOLD, JSON.stringify(storedHousehold));
}

export function getInventory(): InventoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    const items = data ? JSON.parse(data) : [];
    return items.map((item: StoredInventoryItem) => ({
      ...item,
      addedDate: new Date(item.addedDate),
      expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
    }));
  } catch {
    return [];
  }
}

export function setInventory(inventory: InventoryItem[]): void {
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
}

export function getScoreHistory(): ScoreRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCORE_HISTORY);
    const records = data ? JSON.parse(data) : [];
    return records.map((record: StoredScoreRecord) => ({
      ...record,
      date: new Date(record.date),
    }));
  } catch {
    return [];
  }
}

export function setScoreHistory(history: ScoreRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.SCORE_HISTORY, JSON.stringify(history));
}

export function addScoreRecord(record: ScoreRecord): void {
  const history = getScoreHistory();
  history.push(record);
  setScoreHistory(history);
}

export function getAchievements(): Achievement[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    const achievements = data ? JSON.parse(data) : [];
    return achievements.map((achievement: StoredAchievement) => ({
      ...achievement,
      unlockedDate: achievement.unlockedDate ? new Date(achievement.unlockedDate) : undefined,
    }));
  } catch {
    return [];
  }
}

export function setAchievements(achievements: Achievement[]): void {
  localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
}
