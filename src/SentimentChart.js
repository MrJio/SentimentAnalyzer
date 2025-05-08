import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SentimentChart = ({ data, isLoading }) => {
  const hasData =
    data &&
    data.labels &&
    data.labels.length > 0 &&
    data.datasets[0].data.some((val) => val > 0);

    const chartData = hasData
    ? {
        ...data,
        datasets: data.datasets.map(dataset => ({
          ...dataset,
          backgroundColor: ["#38C477", "#AEC6CF", "#F28268"] // NEW COLORS
        }))
      }
    : {
        labels: ["Positive", "Neutral", "Negative"],
        datasets: [
          {
            label: "Sentiment",
            data: [0, 0, 0],
            backgroundColor: ["#38C477", "#AEC6CF", "#F28268"],
          },
        ],
      };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: hasData,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "#000" },
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  const showLoadingOverlay = !hasData || isLoading;

  return (
    <div className="chart-container" style={{ position: "relative" }}>
      <Bar data={chartData} options={options} />
      {showLoadingOverlay && (
        <div
          className="overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgb(0, 0, 0,0.1)",
            borderRadius:"30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2,
            flexDirection: "column",
            textAlign: "center",
            fontSize: "1rem",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          <div
            className="spinner"
            style={{
              width: "30px",
              height: "30px",
              border: "4px solid #ccc",
              borderTop: "4px solid #333",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "10px",
            }}
          />
          Loading data...
        </div>
      )}
    </div>
  );
};

export default SentimentChart;