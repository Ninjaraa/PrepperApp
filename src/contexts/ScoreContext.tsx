import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { ScoreRecord } from '../types';
import { calculateScore } from '../utils/scoring';
import { getScoreHistory, addScoreRecord } from '../utils/storage';
import { useHousehold } from './HouseholdContext';
import { useInventory } from './InventoryContext';
import { useAchievements } from './AchievementContext';

interface ScoreContextType {
  currentScore: ScoreRecord | null;
  scoreHistory: ScoreRecord[];
  calculateAndSaveScore: () => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export function ScoreProvider({ children }: { children: ReactNode }) {
  const { household } = useHousehold();
  const { items } = useInventory();
  const { checkForAchievements } = useAchievements();
  const [currentScore, setCurrentScore] = useState<ScoreRecord | null>(null);
  const [scoreHistory, setScoreHistoryState] = useState<ScoreRecord[]>(() => getScoreHistory());

  useEffect(() => {
    if (household.adults + household.children + household.pets > 0) {
      const score = calculateScore(household, items);
      setCurrentScore(score);
      checkForAchievements(score.totalScore, items.length);
    }
  }, [household, items, checkForAchievements]);

  const calculateAndSaveScore = () => {
    if (currentScore && household.adults + household.children + household.pets > 0) {
      const existingToday = scoreHistory.some(
        (record) =>
          new Date(record.date).toDateString() === new Date().toDateString()
      );

      if (!existingToday) {
        addScoreRecord(currentScore);
        setScoreHistoryState((prev) => [...prev, currentScore]);
      }
    }
  };

  return (
    <ScoreContext.Provider value={{ currentScore, scoreHistory, calculateAndSaveScore }}>
      {children}
    </ScoreContext.Provider>
  );
}

export function useScore() {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error('useScore must be used within a ScoreProvider');
  }
  return context;
}