import { Link } from "react-router-dom";
import { useScore } from "../contexts/ScoreContext";
import { useInventory } from "../contexts/InventoryContext";
import { useHousehold } from "../contexts/HouseholdContext";
import { getItemsExpiringWithin } from "../utils/scoring";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { currentScore } = useScore();
  const { items } = useInventory();
  const { household } = useHousehold();

  const expiringItems = getItemsExpiringWithin(items, 7);
  const hasHousehold =
    household.adults > 0 || household.children > 0 || household.pets > 0;

  if (!hasHousehold) {
    return (
      <div className="text-center py-5">
        <h2>Welcome to PrepperApp</h2>
        <p className="text-muted mb-4">
          Let's start by setting up your household information.
        </p>
        <Link to="/household" className="btn btn-primary">
          Setup Household
        </Link>
      </div>
    );
  }

  if (!currentScore) {
    return <div>Loading...</div>;
  }

  const tierColors: Record<string, string> = {
    Unprepared: "#dc3545",
    Beginner: "#fd7e14",
    Aware: "#ffc107",
    Prepared: "#0d6efd",
    Survivalist: "#198754",
  };

  return (
    <div className="dashboard">
      <div className="row mb-4">
        <div className="col-md-8">
          <h2 className="mb-3">Dashboard</h2>
        </div>
        <div className="col-md-4 text-md-end">
          {expiringItems.length > 0 && (
            <Link to="/inventory" className="btn btn-warning">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {expiringItems.length} items expiring soon
            </Link>
          )}
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Overall Score</h5>
              <div className={styles.scoreDisplay}>
                <div
                  className={styles.scoreCircle}
                  style={{
                    borderColor: tierColors[currentScore.tier],
                    color: tierColors[currentScore.tier],
                  }}
                >
                  <span className={styles.scoreNumber}>
                    {Math.round(currentScore.totalScore)}%
                  </span>
                </div>
              </div>
              <p
                className="text-center mt-3 mb-2 fw-semibold"
                style={{ color: tierColors[currentScore.tier] }}
              >
                Tier: {currentScore.tier}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Category Breakdown</h5>
              <div className="list-group list-group-flush">
                {Object.values(currentScore.categoryScores).map(
                  (categoryScore) => (
                    <div
                      key={categoryScore.category}
                      className="list-group-item d-flex justify-content-between align-items-center px-0"
                    >
                      <span>{categoryScore.category}</span>
                      <div className="d-flex align-items-center">
                        <div
                          className={styles.progressWrapper}
                          style={{ width: "100px", marginRight: "10px" }}
                        >
                          <div
                            className={styles.progressBar}
                            style={{ width: `${categoryScore.score}%` }}
                          ></div>
                        </div>
                        <span
                          className="fw-semibold"
                          style={{ minWidth: "45px", textAlign: "right" }}
                        >
                          {Math.round(categoryScore.score)}%
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <Link
                    to="/inventory"
                    className="btn btn-outline-primary w-100"
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Inventory Item
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link
                    to="/shopping"
                    className="btn btn-outline-primary w-100"
                  >
                    <i className="bi bi-cart me-2"></i>
                    Shopping List
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link
                    to="/achievements"
                    className="btn btn-outline-primary w-100"
                  >
                    <i className="bi bi-trophy me-2"></i>
                    View Achievements
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
