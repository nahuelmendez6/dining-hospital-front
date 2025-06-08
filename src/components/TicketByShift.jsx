import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);


const TicketByShift = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/reports/tickets-by-shift/')
        .then(res => {
            const labels = res.data.map(item => item.type);
            const counts = res.data.map(item => item.count);
            const colors = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'];
    
            setChartData({
              labels: labels,
              datasets: [{
                data: counts,
                backgroundColor: colors.slice(0, labels.length)
              }]
            });
          })
          .catch(err => console.error(err));
      }, []);


      return (
        <div className="w-full p-4 max-w-md mx-auto" style={{ height: '600px' }}>
            <h2 className="text-xl font-semibold mb-4 text-center">Tickets por Tipo</h2>
            {chartData ? (
            <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            ) : (
            <p>Cargando datos...</p>
            )}
        </div>
      );

}

export default TicketByShift;