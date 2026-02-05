
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

interface ChartData {
  type: 'bar' | 'line' | 'area' | 'pie';
  data: any[];
  title: string;
}

const GREEN_PALETTE = ['#10b981', '#059669', '#34d399', '#065f46', '#6ee7b7', '#064e3b'];

export const ChartRenderer: React.FC<{ chart: ChartData }> = ({ chart }) => {
  if (!chart || !chart.data) return null;

  const renderChart = () => {
    switch (chart.type) {
      case 'line':
        return (
          <LineChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#111827" />
            <XAxis dataKey="label" stroke="#065f46" fontSize={9} tickLine={false} axisLine={false} tick={{ fontWeight: 'bold' }} />
            <YAxis stroke="#065f46" fontSize={9} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#020617', borderRadius: '16px', border: '1px solid #065f46', color: '#ecfdf5', fontSize: '12px' }}
              itemStyle={{ color: '#10b981' }}
            />
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#020617' }} activeDot={{ r: 6, stroke: '#fff' }} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chart.data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={8}
            >
              {chart.data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={GREEN_PALETTE[index % GREEN_PALETTE.length]} stroke="rgba(0,0,0,0.3)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#020617', borderRadius: '16px', border: '1px solid #065f46', color: '#ecfdf5' }} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', color: '#059669', fontWeight: 'bold' }} />
          </PieChart>
        );
      default: // bar
        return (
          <BarChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#111827" />
            <XAxis dataKey="label" stroke="#065f46" fontSize={9} tickLine={false} axisLine={false} tick={{ fontWeight: 'bold' }} />
            <YAxis stroke="#065f46" fontSize={9} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{ fill: 'rgba(16,185,129,0.05)' }}
              contentStyle={{ backgroundColor: '#020617', borderRadius: '16px', border: '1px solid #065f46', color: '#ecfdf5' }} 
            />
            <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} shadow="0 0 10px rgba(16,185,129,0.3)" />
          </BarChart>
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {renderChart()}
    </ResponsiveContainer>
  );
};
