import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const SocialMediaChart = ({ data }) => {
  const hasData = data && data.labels && data.labels.length > 0;

  const chartData = hasData
    ? data
    : {
        labels: ["No Data"],
        datasets: [
          {
            label: "Sentiment Score",
            data: [null],
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
            pointRadius: 0,
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
        display: hasData,
      },
    },
    scales: {
      x: {
        display: hasData,
      },
      y: {
        display: hasData,
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
      {!hasData && <div className="no-data-text">No data available</div>}
    </div>
  );
};

export default SocialMediaChart;
