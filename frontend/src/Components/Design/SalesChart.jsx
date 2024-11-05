// SalesChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const data = {
    labels: ['Aug 01', 'Aug 08', 'Aug 15', 'Aug 22', 'Aug 29'],
    datasets: [
      {
        label: 'This Period',
        data: [20000, 21000, 22000, 25000, 23000],
        borderColor: '#8884d8',
        backgroundColor: 'rgba(136, 132, 216, 0.5)',
        fill: true,
      },
      {
        label: 'Last Period',
        data: [15000, 15500, 16000, 18000, 17000],
        borderColor: '#82ca9d',
        backgroundColor: 'rgba(130, 202, 157, 0.5)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Net Sales Comparison',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value / 1000}k`, // Format Y-axis labels
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default SalesChart;
