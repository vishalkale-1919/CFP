import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

// Register ChartJS modules globally
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 12, font: { weight: '600' } } }
  }
};

export function DailyLineChart({ dataPoints = [] }) {
  const chartData = {
    labels: dataPoints.map(d => d.date),
    datasets: [{
      label: 'Daily CO₂ (kg)',
      data: dataPoints.map(d => d.value),
      borderColor: '#16a34a',
      backgroundColor: 'rgba(22, 163, 74, 0.05)',
      fill: true,
      tension: 0.3,
      pointBackgroundColor: '#16a34a'
    }]
  };

  return <div className="h-64"><Line options={chartOptions} data={chartData} /></div>;
}

export function EmissionPieChart({ breakdown = {} }) {
  const chartData = {
    labels: Object.keys(breakdown),
    datasets: [{
      data: Object.values(breakdown),
      backgroundColor: ['#15803d', '#22c55e', '#86efac', '#bbf7d0'],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  return <div className="h-64"><Pie options={chartOptions} data={chartData} /></div>;
}

export function MonthlyBarChart({ history = [] }) {
  const chartData = {
    labels: history.map(h => h.month),
    datasets: [{
      label: 'Monthly Mass Cumulative (kg)',
      data: history.map(h => h.value),
      backgroundColor: '#14532d',
      borderRadius: 6
    }]
  };

  return <div className="h-64"><Bar options={chartOptions} data={chartData} /></div>;
}