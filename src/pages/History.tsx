import { useEffect, useRef } from "react";
import { useScore } from "../contexts/ScoreContext";
import styles from "./History.module.css";

interface ChartInstance {
  destroy: () => void;
}

export default function History() {
  const { scoreHistory } = useScore();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartInstance | null>(null);

  useEffect(() => {
    if (scoreHistory.length === 0) return;

    const ctx = chartRef.current?.getContext("2d");
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const sortedHistory = [...scoreHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const labels = sortedHistory.map((record) =>
      new Date(record.date).toLocaleDateString(),
    );

    const data = sortedHistory.map((record) => record.totalScore);

    const tierColors: Record<string, string> = {
      Unprepared: "#dc3545",
      Beginner: "#fd7e14",
      Aware: "#ffc107",
      Prepared: "#0d6efd",
      Survivalist: "#198754",
    };

    const pointColors = sortedHistory.map((record) => tierColors[record.tier]);

    const chart = new window.Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Preparedness Score (%)",
            data,
            borderColor: "#2e8987",
            backgroundColor: "rgba(46, 137, 135, 0.1)",
            fill: true,
            tension: 0.3,
            pointBackgroundColor: pointColors,
            pointBorderColor: pointColors,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: pointColors,
            pointHoverBorderColor: pointColors,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              usePointStyle: true,
              padding: 20,
            },
          },
          tooltip: {
            callbacks: {
              afterLabel: (context: { dataIndex: number }) => {
                const record = sortedHistory[context.dataIndex];
                return `Tier: ${record.tier}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function (value: number) {
                return value + "%";
              },
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });

    chartInstanceRef.current = chart as ChartInstance;

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [scoreHistory]);

  const sortedHistory = [...scoreHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const tierColors: Record<string, string> = {
    Unprepared: "#dc3545",
    Beginner: "#fd7e14",
    Aware: "#ffc107",
    Prepared: "#0d6efd",
    Survivalist: "#198754",
  };

  return (
    <div className="history">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Score History</h2>
      </div>

      {scoreHistory.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i
              className="bi bi-graph-up text-muted mb-3"
              style={{ fontSize: "4rem" }}
            ></i>
            <h3>No Score History Yet</h3>
            <p className="text-muted mb-4">
              Start building your inventory to track your preparedness progress
              over time.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Preparedness Progress</h5>
              <div style={{ height: "400px" }}>
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">History Log</h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Score</th>
                      <th>Tier</th>
                      <th>Categories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedHistory.map((record, index) => (
                      <tr key={`${record.date.toISOString()}-${index}`}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>
                          <span
                            className="fw-semibold"
                            style={{ color: tierColors[record.tier] }}
                          >
                            {Math.round(record.totalScore)}%
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${styles.tierBadge}`}
                            style={{ backgroundColor: tierColors[record.tier] }}
                          >
                            {record.tier}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">
                            {Object.entries(record.categoryScores)
                              .map(
                                ([cat, score]) =>
                                  `${cat}: ${Math.round(score.score)}%`,
                              )
                              .join(", ")}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
