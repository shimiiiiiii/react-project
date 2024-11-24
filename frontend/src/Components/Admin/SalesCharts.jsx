import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale, 
    LinearScale, 
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const SalesCharts = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [monthlyData, setMonthlyData] = useState({});
    const [allMonthsData, setAllMonthsData] = useState({});

    const fetchMonthlySales = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/sales/monthly-sales?startDate=${startDate}&endDate=${endDate}`);
            const labels = data.map(item => item._id); // Daily labels
            const sales = data.map(item => item.dailySales);

            setMonthlyData({
                labels,
                datasets: [
                    {
                        label: 'Daily Sales',
                        data: sales,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true
                    }
                ]
            });
        } catch (error) {
            console.error('Error fetching monthly sales:', error);
        }
    };

    const fetchAllMonthsSales = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/sales/all-months-sales`);
            const labels = data.map(item => item._id); // Monthly labels
            const sales = data.map(item => item.monthlySales);

            setAllMonthsData({
                labels,
                datasets: [
                    {
                        label: 'Monthly Sales',
                        data: sales,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }
                ]
            });
        } catch (error) {
            console.error('Error fetching all months sales:', error);
        }
    };

    useEffect(() => {
        if (startDate && endDate) fetchMonthlySales();
        fetchAllMonthsSales();
    }, [startDate, endDate]);

    return (
        <div>
            <h3>Sales Charts</h3>
            <div>
                <label>Start Date:</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <label>End Date:</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                <button onClick={fetchMonthlySales}>Filter</button>
            </div>

            <div>
                <h4>Monthly Sales (Line Chart)</h4>
                {monthlyData.labels && <Line data={monthlyData} />}
            </div>

            <div>
                <h4>All Months Sales (Bar Chart)</h4>
                {allMonthsData.labels && <Bar data={allMonthsData} />}
            </div>
        </div>
    );
};

export default SalesCharts;
