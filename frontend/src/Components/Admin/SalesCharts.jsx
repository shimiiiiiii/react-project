import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../CSS/Chart.css'; 
import Dashboard from './Dashboard';

const MonthlySalesChart = () => {
    const [salesData, setSalesData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchSalesData = async () => {
        try {
            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const { data } = await axios.get(`${import.meta.env.VITE_API}/monthly-sales`, { params });
            setSalesData(data);
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
    };

    useEffect(() => {
        fetchSalesData(); // Fetch data on component mount or date change
    }, [startDate, endDate]);

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Monthly Sales',
                data: salesData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: true },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };

    return (
        <Dashboard>
            <div className="chart-container">
                <h2>Monthly Sales Chart</h2>
                <div className="date-picker-container">
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <label htmlFor="endDate">End Date:</label>
                    <input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <button onClick={fetchSalesData}>Filter</button>
                </div>
                <Line data={chartData} options={options} />
            </div>
        </Dashboard>
    );
    
};

export default MonthlySalesChart;
