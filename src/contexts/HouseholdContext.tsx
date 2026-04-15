import { createContext, useContext, useState, ReactNode } from "react";
import type { Household, DietaryRestriction, Allergy } from "../types";
import { getHousehold, setHousehold as saveHousehold } from "../utils/storage";

interface HouseholdContextType {
  household: Household;
  setHousehold: (household: Household) => void;
  addDietaryRestriction: (restriction: DietaryRestriction) => void;
  removeDietaryRestriction: (restriction: DietaryRestriction) => void;
  addAllergy: (allergy: Allergy) => void;
  removeAllergy: (allergy: Allergy) => void;
}

const HouseholdContext = createContext<HouseholdContextType | undefined>(
  undefined,
);

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const [household, setHouseholdState] = useState<Household>(() =>
    getHousehold(),
  );

  const handleSetHousehold = (newHousehold: Household) => {
    setHouseholdState(newHousehold);
    saveHousehold(newHousehold);
  };

  const addDietaryRestriction = (restriction: DietaryRestriction) => {
    const newRestrictions = [...(household.dietaryRestrictions || [])];
    if (!newRestrictions.includes(restriction)) {
      newRestrictions.push(restriction);
      handleSetHousehold({
        ...household,
        dietaryRestrictions: newRestrictions,
      });
    }
  };

  const removeDietaryRestriction = (restriction: DietaryRestriction) => {
    const newRestrictions = (household.dietaryRestrictions || []).filter(
      (r) => r !== restriction,
    );
    handleSetHousehold({
      ...household,
      dietaryRestrictions: newRestrictions,
    });
  };

  const addAllergy = (allergy: Allergy) => {
    const newAllergies = [...(household.allergies || [])];
    if (!newAllergies.includes(allergy)) {
      newAllergies.push(allergy);
      handleSetHousehold({
        ...household,
        allergies: newAllergies,
      });
    }
  };

  const removeAllergy = (allergy: Allergy) => {
    const newAllergies = (household.allergies || []).filter(
      (a) => a !== allergy,
    );
    handleSetHousehold({
      ...household,
      allergies: newAllergies,
    });
  };

  return (
    <HouseholdContext.Provider
      value={{
        household,
        setHousehold: handleSetHousehold,
        addDietaryRestriction,
        removeDietaryRestriction,
        addAllergy,
        removeAllergy,
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error("useHousehold must be used within a HouseholdProvider");
  }
  return context;
}
