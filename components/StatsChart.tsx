import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { InventoryItem } from '../types';

interface StatsChartProps {
  items: InventoryItem[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#3b82f6'];

const StatsChart: React.FC<StatsChartProps> = ({ items }) => {
  const data = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    
    items.forEach(item => {
      const total = item.value * item.quantity;
      if (categoryTotals[item.category]) {
        categoryTotals[item.category] += total;
      } else {
        categoryTotals[item.category] = total;
      }
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value
    })).sort((a, b) => b.value - a.value);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-400">
        Adicione itens para ver as estatísticas
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Valor Total por Categoria (R$)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            tick={{fontSize: 12, fill: '#6b7280'}} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{fontSize: 12, fill: '#6b7280'}} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `R$${value}`}
          />
          <Tooltip 
            cursor={{fill: '#f3f4f6'}}
            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;
