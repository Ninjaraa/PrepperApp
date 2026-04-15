import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useShoppingList } from "../contexts/ShoppingContext";
import { useHousehold } from "../contexts/HouseholdContext";
import type { FilteredSuggestion } from "../types";
import styles from "./Suggestions.module.css";
import { getFilteredSuggestions } from "../utils/suggestionFilter";

const CATEGORIES = [
  "Water",
  "Food",
  "Medical",
  "Communication",
  "Gear",
  "Energy",
  "Skills",
];

const PRIORITY_LABELS: Record<number, string> = {
  1: "Essential",
  2: "Recommended",
  3: "Optional",
};

const PRIORITY_COLORS: Record<number, string> = {
  1: "#dc3545",
  2: "#0d6efd",
  3: "#6c757d",
};

export default function Suggestions() {
  const { household } = useHousehold();
  const { addShoppingItem, shoppingItems } = useShoppingList();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<FilteredSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(CATEGORIES),
  );

  const loadSuggestions = useCallback(async () => {
    setLoading(true);
    const filteredSuggestions = await getFilteredSuggestions(household);
    setSuggestions(filteredSuggestions);
    setLoading(false);
  }, [household]);

  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getCategorySuggestions = (category: string) => {
    return suggestions.filter((s) => s.item.category === category);
  };

  const isAlreadyAdded = (suggestion: FilteredSuggestion) => {
    return shoppingItems.some(
      (i) =>
        i.name === suggestion.item.name &&
        i.category === suggestion.item.category,
    );
  };

  const handleAddToShoppingList = (suggestion: FilteredSuggestion) => {
    addShoppingItem({
      name: suggestion.item.name,
      category: suggestion.item.category,
      quantity: suggestion.quantity,
      unit: suggestion.item.unit,
    });
    navigate("/shopping");
  };

  const hasHousehold = household.adults > 0 || household.children > 0;

  if (!hasHousehold) {
    return (
      <div className="suggestions">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Shopping Suggestions</h2>
        </div>
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i
              className="bi bi-people text-muted mb-3"
              style={{ fontSize: "4rem" }}
            ></i>
            <h3>Configure Your Household</h3>
            <p className="text-muted mb-4">
              Please configure your household members first to get personalized
              shopping suggestions.
            </p>
            <a href="/household" className="btn btn-primary">
              Setup Household
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="suggestions">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Shopping Suggestions</h2>
        </div>
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading personalized suggestions...</p>
          </div>
        </div>
      </div>
    );
  }

  const activeDietary = household.dietaryRestrictions || [];
  const activeAllergies = household.allergies || [];

  return (
    <div className="suggestions">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Shopping Suggestions</h2>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Your Preferences</h5>
          <div className="row">
            <div className="col-md-6">
              <h6 className="mb-2">
                <i className="bi bi-check-circle me-2"></i>
                Dietary Restrictions
              </h6>
              {activeDietary.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {activeDietary.map((restriction) => (
                    <span key={restriction} className="badge bg-primary">
                      {restriction}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted small">None selected</p>
              )}
            </div>
            <div className="col-md-6">
              <h6 className="mb-2">
                <i className="bi bi-shield-exclamation me-2"></i>
                Allergies
              </h6>
              {activeAllergies.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {activeAllergies.map((allergy) => (
                    <span key={allergy} className="badge bg-warning">
                      {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted small">None selected</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {suggestions.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i
              className="bi bi-check-circle text-success mb-3"
              style={{ fontSize: "4rem" }}
            ></i>
            <h3>All Caught Up!</h3>
            <p className="text-muted">
              Your inventory is well-stocked. Check back periodically to ensure
              supplies are current.
            </p>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            {CATEGORIES.map((category) => {
              const categorySuggestions = getCategorySuggestions(category);
              if (categorySuggestions.length === 0) return null;

              const isExpanded = expandedCategories.has(category);

              return (
                <div className="card shadow-sm mb-3" key={category}>
                  <div
                    className={`card-header d-flex justify-content-between align-items-center ${styles.categoryHeader}`}
                    onClick={() => toggleCategory(category)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center">
                      <i className={`bi ${getCategoryIcon(category)} me-2`}></i>
                      <h5 className="mb-0">{category}</h5>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="badge bg-secondary me-3">
                        {categorySuggestions.length} items
                      </span>
                      <i
                        className={`bi ${isExpanded ? "bi-chevron-up" : "bi-chevron-down"}`}
                      ></i>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className={`card-body ${styles.categoryBody}`}>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Item</th>
                              <th>Quantity</th>
                              <th>Priority</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categorySuggestions.map((suggestion) => {
                              const added = isAlreadyAdded(suggestion);
                              return (
                                <tr key={suggestion.item.id}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div>
                                        <strong>{suggestion.item.name}</strong>
                                        <div className="text-muted small">
                                          Target:{" "}
                                          {suggestion.item.targetAudience}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <span className="quantity">
                                      {suggestion.quantity}{" "}
                                      {suggestion.item.unit}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      className="badge"
                                      style={{
                                        backgroundColor:
                                          PRIORITY_COLORS[
                                            suggestion.item.categoryPriority
                                          ],
                                      }}
                                    >
                                      {
                                        PRIORITY_LABELS[
                                          suggestion.item.categoryPriority
                                        ]
                                      }
                                    </span>
                                  </td>
                                  <td>
                                    <button
                                      className={`btn btn-sm ${added ? "btn-success" : "btn-outline-primary"}`}
                                      onClick={() =>
                                        !added &&
                                        handleAddToShoppingList(suggestion)
                                      }
                                      disabled={added}
                                    >
                                      <i
                                        className={`bi ${added ? "bi-check-circle" : "bi-plus-circle"} me-1`}
                                      ></i>
                                      {added ? "Added" : "Add to Shopping List"}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card bg-light mt-4">
        <div className="card-body">
          <h6 className="mb-2">
            <i className="bi bi-info-circle me-2"></i>
            Shopping Tips
          </h6>
          <ul className="mb-0">
            <li className="mb-1">
              Check expiration dates and rotate stock regularly
            </li>
            <li className="mb-1">Store items in a cool, dry place</li>
            <li className="mb-1">
              Review and update your inventory every 6 months
            </li>
            <li>
              Consider specific needs of family members with dietary
              restrictions
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    Water: "bi-droplet",
    Food: "bi-basket",
    Medical: "bi-heart-pulse",
    Communication: "bi-phone",
    Gear: "bi-tools",
    Energy: "bi-lightning-charge",
    Skills: "bi-book",
  };
  return icons[category] || "bi-box";
}
