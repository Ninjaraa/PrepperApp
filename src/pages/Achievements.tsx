import type { Tier } from "../types";
import styles from "./Achievements.module.css";
import { useAchievements } from "../contexts/AchievementContext";

export default function Achievements() {
  const { achievements } = useAchievements();

  const tierColors: Record<Tier, string> = {
    Unprepared: "#dc3545",
    Beginner: "#fd7e14",
    Aware: "#ffc107",
    Prepared: "#0d6efd",
    Survivalist: "#198754",
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="achievements">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Achievements</h2>
        <div className="text-muted">
          <i className="bi bi-trophy me-2"></i>
          {unlockedCount} / {achievements.length} unlocked
        </div>
      </div>

      <div className="summary">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center py-4">
                <i
                  className="bi bi-trophy text-warning mb-3"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h3 className="mb-1">{unlockedCount}</h3>
                <p className="text-muted mb-0">Achievements Unlocked</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center py-4">
                <i
                  className="bi bi-gear text-info mb-3"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h3 className="mb-1">{achievements.length - unlockedCount}</h3>
                <p className="text-muted mb-0">Pending Achievements</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center py-4">
                <i
                  className="bi bi-bar-chart-fill text-success mb-3"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h3 className="mb-1">
                  {Math.round((unlockedCount / achievements.length) * 100)}%
                </h3>
                <p className="text-muted mb-0">Completion Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        {achievements.map((achievement) => (
          <div className="col-md-6 col-lg-4 mb-4" key={achievement.id}>
            <div
              className={`card shadow-sm h-100 ${styles.achievementCard} ${
                achievement.unlocked ? styles.unlocked : styles.locked
              }`}
            >
              <div className="card-body">
                <div className="d-flex align-items-start mb-3">
                  <div
                    className={`${styles.iconContainer} me-3`}
                    style={
                      achievement.unlocked
                        ? { backgroundColor: tierColors[achievement.tier] }
                        : { backgroundColor: "#dee2e6" }
                    }
                  >
                    <i
                      className={`bi ${
                        achievement.unlocked ? "bi-trophy-fill" : "bi-lock-fill"
                      } text-white`}
                    ></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h5
                      className={`card-title mb-1 ${achievement.unlocked ? "" : styles.lockedText}`}
                    >
                      {achievement.name}
                    </h5>
                    <span
                      className={`badge ${styles.tierBadge}`}
                      style={{
                        backgroundColor: tierColors[achievement.tier],
                      }}
                    >
                      {achievement.tier}
                    </span>
                  </div>
                </div>
                <p
                  className={`card-text small text-muted mb-0 ${
                    !achievement.unlocked ? styles.lockedText : ""
                  }`}
                >
                  {achievement.description}
                </p>
                {achievement.unlocked && achievement.unlockedDate && (
                  <p className="small text-muted mb-0 mt-2">
                    <i className="bi bi-calendar-check me-1"></i>
                    Unlocked on{" "}
                    {new Date(achievement.unlockedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
