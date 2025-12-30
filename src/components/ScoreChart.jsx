import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const MAX_SESSIONS = 12;

function ScoreChart({ stats }) {
  if (!stats || stats.length === 0) return null;

  const displayedStats = stats
    .slice(0, MAX_SESSIONS)
    .reverse();

  const totalSessions = stats.length;
  const startIndex = Math.max(totalSessions - MAX_SESSIONS, 0);

  const data = {
    labels: displayedStats.map(
      (_, index) => `Sesión ${startIndex + index + 1}`
    ),
    datasets: [
      {
        label: "Puntaje",
        data: displayedStats.map(s => s.score),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Puntaje: ${ctx.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Puntaje",
        },
      },
      x: {
        title: {
          display: true,
          text: "Sesiones",
        },
      },
    },
  };

  return (
    <div style={{ height: "300px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default ScoreChart;
