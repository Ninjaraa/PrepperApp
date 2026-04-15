import { useState } from "react";
import { useHousehold } from "../contexts/HouseholdContext";
import type { DietaryRestriction, Allergy } from "../types";
import styles from "./Household.module.css";

export default function Household() {
  const {
    household,
    setHousehold,
    addDietaryRestriction,
    removeDietaryRestriction,
    addAllergy,
    removeAllergy,
  } = useHousehold();
  const [localHousehold, setLocalHousehold] = useState(household);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof typeof household, delta: number) => {
    const currentValue = localHousehold[field] as number;
    const newValue = Math.max(0, currentValue + delta);
    setLocalHousehold({ ...localHousehold, [field]: newValue });
    setSaved(false);
  };

  const handleSave = () => {
    setHousehold(localHousehold);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const dietaryRestrictions: DietaryRestriction[] = [
    "Vegetarian",
    "Vegan",
    "GlutenFree",
    "DairyFree",
    "NutFree",
  ];
  const allergies: Allergy[] = [
    "Nuts",
    "TreeNuts",
    "Shellfish",
    "Gluten",
    "Dairy",
    "Eggs",
    "Soy",
    "Fish",
    "ShellfishEggs",
    "Peanuts",
  ];

  const toggleDietaryRestriction = (restriction: DietaryRestriction) => {
    const currentRestrictions = localHousehold.dietaryRestrictions || [];
    if (currentRestrictions.includes(restriction)) {
      removeDietaryRestriction(restriction);
      setLocalHousehold({
        ...localHousehold,
        dietaryRestrictions: currentRestrictions.filter(
          (r) => r !== restriction,
        ),
      });
    } else {
      addDietaryRestriction(restriction);
      setLocalHousehold({
        ...localHousehold,
        dietaryRestrictions: [...currentRestrictions, restriction],
      });
    }
  };

  const toggleAllergy = (allergy: Allergy) => {
    const currentAllergies = localHousehold.allergies || [];
    if (currentAllergies.includes(allergy)) {
      removeAllergy(allergy);
      setLocalHousehold({
        ...localHousehold,
        allergies: currentAllergies.filter((a) => a !== allergy),
      });
    } else {
      addAllergy(allergy);
      setLocalHousehold({
        ...localHousehold,
        allergies: [...currentAllergies, allergy],
      });
    }
  };

  const householdFields = [
    {
      key: "adults" as const,
      label: "Adults",
      icon: "bi-person",
      unit: "adult",
      description: "People 18 years or older",
    },
    {
      key: "children" as const,
      label: "Children",
      icon: "bi-person-standing",
      unit: "child",
      description: "People under 18 years old",
    },
    {
      key: "pets" as const,
      label: "Pets",
      icon: "bi-heart",
      unit: "pet",
      description: "Pets in the household",
    },
  ];

  return (
    <div className="household">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Household Configuration</h2>
        <button
          className={`btn ${saved ? "btn-success" : "btn-primary"}`}
          onClick={handleSave}
          disabled={saved}
        >
          {saved ? (
            <>
              <i className="bi bi-check-circle me-2"></i>
              Saved
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <p className="text-muted mb-4">
            Configure your household members to calculate appropriate supply
            targets based on MSB guidelines.
          </p>

          <div className="row g-4">
            {householdFields.map((field) => (
              <div className="col-md-4" key={field.key}>
                <div className={styles.memberCard}>
                  <div className="text-center mb-3">
                    <i className={`bi ${field.icon} ${styles.memberIcon}`}></i>
                  </div>
                  <h5 className="text-center mb-2">{field.label}</h5>
                  <p className="text-muted text-center small mb-3">
                    {field.description}
                  </p>
                  <div className={styles.counter}>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => handleChange(field.key, -1)}
                      disabled={localHousehold[field.key] === 0}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <span className={styles.counterValue}>
                      {localHousehold[field.key]}
                    </span>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => handleChange(field.key, 1)}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Daily Supply Targets</h5>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Daily Target</th>
                  <th>3-Week Target</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Water</td>
                  <td>
                    {(
                      localHousehold.adults * 3 +
                      localHousehold.children * 2 +
                      localHousehold.pets * 0.5
                    ).toFixed(1)}
                    L
                  </td>
                  <td>
                    {(
                      (localHousehold.adults * 3 +
                        localHousehold.children * 2 +
                        localHousehold.pets * 0.5) *
                      21
                    ).toFixed(1)}
                    L
                  </td>
                </tr>
                <tr>
                  <td>Food</td>
                  <td>
                    {localHousehold.adults * 2000 +
                      localHousehold.children * 1500}{" "}
                    kcal
                  </td>
                  <td>
                    {(localHousehold.adults * 2000 +
                      localHousehold.children * 1500) *
                      21}{" "}
                    kcal
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-muted text-center">
                    Medical, Communication, Gear, Energy, and Skills targets are
                    based on item counts
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">
            <i className="bi bi-check-circle me-2"></i>
            Dietary Restrictions
          </h5>
          <p className="text-muted small mb-3">
            Select any dietary restrictions to personalize shopping suggestions.
          </p>
          <div className="row g-2">
            {dietaryRestrictions.map((restriction) => (
              <div className="col-md-2 col-sm-4" key={restriction}>
                <button
                  className={`btn w-100 ${
                    localHousehold.dietaryRestrictions?.includes(restriction)
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => toggleDietaryRestriction(restriction)}
                >
                  {restriction}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">
            <i className="bi bi-shield-exclamation me-2"></i>
            Allergies
          </h5>
          <p className="text-muted small mb-3">
            Select any allergies to exclude from shopping suggestions.
          </p>
          <div className="row g-2">
            {allergies.map((allergy) => (
              <div className="col-md-2 col-sm-4" key={allergy}>
                <button
                  className={`btn w-100 ${
                    localHousehold.allergies?.includes(allergy)
                      ? "btn-warning"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => toggleAllergy(allergy)}
                >
                  {allergy}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
