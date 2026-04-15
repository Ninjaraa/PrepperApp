import type { ReactNode } from "react";
import { HouseholdProvider } from "./HouseholdContext";
import { InventoryProvider } from "./InventoryContext";
import { AchievementProvider } from "./AchievementContext";
import { ScoreProvider } from "./ScoreContext";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <HouseholdProvider>
      <InventoryProvider>
        <AchievementProvider>
          <ScoreProvider>{children}</ScoreProvider>
        </AchievementProvider>
      </InventoryProvider>
    </HouseholdProvider>
  );
}
