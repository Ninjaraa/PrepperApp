import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { Achievement } from "../types";
import { getAchievements, setAchievements } from "../utils/storage";

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Add your first household member",
    tier: "Unprepared",
  },
  {
    id: "first-item",
    name: "Building Supplies",
    description: "Add your first inventory item",
    tier: "Unprepared",
  },
  {
    id: "water-ready",
    name: "Water Security",
    description: "Reach 100% water supply",
    tier: "Beginner",
  },
  {
    id: "food-ready",
    name: "Food Security",
    description: "Reach 100% food supply",
    tier: "Beginner",
  },
  {
    id: "well-stocked",
    name: "Well Stocked",
    description: "Reach 50% overall preparedness",
    tier: "Aware",
  },
  {
    id: "survivalist",
    name: "Survivalist",
    description: "Reach 80% overall preparedness",
    tier: "Prepared",
  },
  {
    id: "outstanding",
    name: "Outstanding",
    description: "Reach 100% overall preparedness",
    tier: "Survivalist",
  },
];

interface AchievementContextType {
  achievements: Achievement[];
  checkForAchievements: (score: number, totalItems: number) => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(
  undefined,
);

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [achievements, setAchievementsState] = useState<Achievement[]>(() => {
    const saved = getAchievements();
    return saved.length > 0 ? saved : DEFAULT_ACHIEVEMENTS;
  });

  const checkForAchievements = useCallback(
    (score: number, totalItems: number) => {
      setAchievementsState((prev) => {
        const updated = prev.map((achievement) => {
          let shouldBeUnlocked = false;

          switch (achievement.id) {
            case "first-steps":
              shouldBeUnlocked = totalItems > 0;
              break;
            case "first-item":
              shouldBeUnlocked = totalItems > 0;
              break;
            case "water-ready":
            case "food-ready":
              shouldBeUnlocked = score >= 50;
              break;
            case "well-stocked":
              shouldBeUnlocked = score >= 50;
              break;
            case "survivalist":
              shouldBeUnlocked = score >= 80;
              break;
            case "outstanding":
              shouldBeUnlocked = score >= 100;
              break;
          }

          if (shouldBeUnlocked && !achievement.unlocked) {
            return { ...achievement, unlocked: true, unlockedDate: new Date() };
          }

          if (!shouldBeUnlocked && achievement.unlocked) {
            return { ...achievement, unlocked: false, unlockedDate: undefined };
          }

          return achievement;
        });

        const hasChanges = updated.some(
          (a, i) => a.unlocked !== prev[i].unlocked,
        );

        if (hasChanges) {
          setAchievements(updated);
          return updated;
        }

        return prev;
      });
    },
    [],
  );

  return (
    <AchievementContext.Provider value={{ achievements, checkForAchievements }}>
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error(
      "useAchievements must be used within an AchievementProvider",
    );
  }
  return context;
}
