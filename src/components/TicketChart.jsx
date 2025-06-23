import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

import TicketByShift from './TicketByShift';
import TicketSummaryCards from './reports/TicketSummaryCards';
import Layout from './Layout';
import StockReport from './StockReport';
import ItemShiftReport from './ItemShiftReport';
import ItemTrendReport from './ItemTrendReport';

const TicketChart = () => {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('tickets');

  useEffect(() => {
    axios.get('http://localhost:8000/reports/tickets-last-7-days/')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tickets':
        return (
          <>
            <TicketSummaryCards />
            <div className="w-full h-96 p-4">
              <h2 className="text-xl font-semibold mb-4">Tickets generados (últimos 7 días)</h2>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} domain={[0, 'dataMax + 1']} />
                  <CartesianGrid stroke="#ccc" />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <TicketByShift />
          </>
        );
      case 'stock':
        return <StockReport />;
      case 'consumo':
        return <ItemShiftReport />;
      case 'tendencias':
        return <ItemTrendReport />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 px-4">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded ${
            activeTab === 'tickets' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Tickets
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`px-4 py-2 rounded ${
            activeTab === 'stock' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Stock
        </button>
        <button
          onClick={() => setActiveTab('consumo')}
          className={`px-4 py-2 rounded ${
            activeTab === 'consumo' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Consumo por ítem
        </button>
        <button
          onClick={() => setActiveTab('tendencias')}
          className={`px-4 py-2 rounded ${
            activeTab === 'tendencias' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Tendencias
        </button>
      </div>

      {/* Contenido del tab */}
      <div className="px-4">
        {renderTabContent()}
      </div>
    </Layout>
  );
};

export default TicketChart;