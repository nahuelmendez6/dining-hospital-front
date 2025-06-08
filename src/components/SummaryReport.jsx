import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SummaryReport() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/reports/summary/').then(res => setSummary(res.data));
  }, []);

  if (!summary) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(summary).map(([key, value]) => (
        <div key={key} className="bg-blue-100 text-blue-800 p-4 rounded-lg text-center shadow">
          <h3 className="text-sm uppercase">{key.replaceAll('_', ' ')}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      ))}
    </div>
  );
}
