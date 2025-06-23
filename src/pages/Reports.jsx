import React, { useState } from 'react';
import Layout from '../components/Layout';

import TicketsLast7DaysChart from '../components/reports/TicketsLast7DaysChart';
import TicketsByShiftChart from '../components/reports/TicketByShiftChart';
import ItemConsumptionTrend from '../components/reports/ItemConsumptionTrend';
import ItemConsumptionByShiftChart from '../components/reports/ItemConsumptionByShiftChart';
import ObservationsReportChart from '../components/reports/ObservationsReportChart';
import ItemConsumptionVsStockChart from '../components/reports/ItemConsumptionVsStockChart';
import StockEvaluationReport from '../components/reports/StockEvaluationReport';
import TicketSummaryCards from '../components/reports/TicketSummaryCards';
import StockDepletionForecastReport from '../components/reports/StockDepletionForecastReport';
import StockDepletionForecastChart from '../components/reports/StockDepletionForecastChart';
import UserConsumptionReport from '../components/reports/UserConsumptionReport';
import UserConsumptionReportChart from '../components/reports/UserConsumptionReportChart';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('tickets');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState('');

  const renderContent = () => {
    switch (activeTab) {
      case 'tickets':
        return (
          <>
            {/* Sección resumen: ocupa 100% */}
            <div style={{ marginBottom: 20 }}>
              <TicketSummaryCards startDate={startDate} endDate={endDate} status={status} />
            </div>

            {/* Sección de gráficos: grid responsive */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              <div>
                <TicketsLast7DaysChart startDate={startDate} endDate={endDate} status={status} />
              </div>
              <div>
                <TicketsByShiftChart startDate={startDate} endDate={endDate} status={status} />
              </div>
            </div>
          </>
        );
      case 'itemConsumption':
        return (
          <>
            
            <ItemConsumptionTrend startDate={startDate} endDate={endDate} status={status} />

            
            <ItemConsumptionByShiftChart startDate={startDate} endDate={endDate} status={status} />

            
            <ItemConsumptionVsStockChart startDate={startDate} endDate={endDate} status={status} />

            <UserConsumptionReport startDate={startDate} endDate={endDate} status={status} />

            <UserConsumptionReportChart startDate={startDate} endDate={endDate} status={status} />

            
          </>
        );
      
      case 'stock':
        return (
          <>
            <StockEvaluationReport startDate={startDate} endDate={endDate} status={status} />

            <StockDepletionForecastReport startDate={startDate} endDate={endDate} status={status} />

            <StockDepletionForecastChart startDate={startDate} endDate={endDate} status={status} />
          </>
        )
      
      case 'observations':
        return (
          <>
            
            <ObservationsReportChart startDate={startDate} endDate={endDate} status={status} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div style={{ marginBottom: 20 }}>
        <h2>Filtros Globales</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label>Fecha Inicio</label><br />
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <label>Fecha Fin</label><br />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <div>
            <label>Estado</label><br />
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">Todos (used + pending)</option>
              <option value="pending">Pendiente</option>
              <option value="used">Usado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      <nav style={{ marginBottom: 20, borderBottom: '1px solid #ccc' }}>
        <button
          onClick={() => setActiveTab('tickets')}
          style={{
            marginRight: 10,
            padding: '8px 16px',
            border: 'none',
            borderBottom: activeTab === 'tickets' ? '3px solid #007bff' : '3px solid transparent',
            background: 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'tickets' ? 'bold' : 'normal',
          }}
        >
          Tickets
        </button>
        <button
          onClick={() => setActiveTab('itemConsumption')}
          style={{
            marginRight: 10,
            padding: '8px 16px',
            border: 'none',
            borderBottom: activeTab === 'itemConsumption' ? '3px solid #007bff' : '3px solid transparent',
            background: 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'itemConsumption' ? 'bold' : 'normal',
          }}
        >
          Consumo Ítems
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          style={{
            marginRight: 10,
            padding: '8px 16px',
            border: 'none',
            borderBottom: activeTab === 'stock' ? '3px solid #007bff' : '3px solid transparent',
            background: 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'stock' ? 'bold' : 'normal',
          }}
        >
          Stock
        </button>
        <button
          onClick={() => setActiveTab('observations')}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderBottom: activeTab === 'observations' ? '3px solid #007bff' : '3px solid transparent',
            background: 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'observations' ? 'bold' : 'normal',
          }}
        >
          Observaciones
        </button>
      </nav>

      <section>{renderContent()}</section>
    </Layout>
  );
};

export default Reports;
