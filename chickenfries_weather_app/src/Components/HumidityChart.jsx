import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import './HumidityChart.css';

// Register necessary Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

const HumidityChart = ({ humidityData = [] }) => {
  // Sample labels for the pie chart
  const labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];

  // Data configuration
  const data = {
    labels: labels.slice(0, humidityData.length),
    datasets: [
      {
        label: 'Humidity Levels',
        data: humidityData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
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
  };

  return (
    <div className="humidity-chart">
      <h2 style={{ color: 'white' }}>Humidity Distribution</h2>
      <Pie data={data} options={options} />
    </div>
  );
};

export default HumidityChart;