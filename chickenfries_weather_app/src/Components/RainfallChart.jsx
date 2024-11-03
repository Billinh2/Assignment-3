import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import './RainfallChart.css';

// Register necessary Chart.js components
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const RainfallChart = ({ rainfallData = [] }) => {
  // Sample labels for the bar chart
  const labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];

  // Data configuration for the bar chart
  const data = {
    labels: labels.slice(0, rainfallData.length),
    datasets: [
      {
        label: 'Rainfall (mm)',
        data: rainfallData,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options configuration
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          color: 'white',
        },
        ticks: {
          color: 'white',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Rainfall (mm)',
          color: 'white',
        },
        ticks: {
          color: 'white',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="rainfall-chart left-align">
      <h2 style={{ color: 'white' }}>Rainfall Over Time</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default RainfallChart;