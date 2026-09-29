'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis 
} from 'recharts';

interface ChartProps {
  data: {
    subject: string;
    'Idade Cognitiva': number;
    'Idade Cronológica': number;
  }[];
}

// 1. O GRÁFICO DE BARRAS EXISTENTE
export const BarGapChart = ({ data }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EDE8" />
        <XAxis 
          dataKey="subject" 
          stroke="#627268" 
          fontSize={11} 
          tickLine={false} 
        />
        <YAxis 
          stroke="#627268" 
          fontSize={11} 
          tickLine={false} 
        />
        <Tooltip 
          cursor={{ fill: 'rgba(38, 83, 58, 0.05)' }}
          contentStyle={{
            backgroundColor: '#1D3E2B',
            borderRadius: '12px',
            border: 'none',
            color: '#FFFFFF',
            boxShadow: '0 10px 25px rgba(29, 62, 43, 0.25)',
            fontSize: '12px',
            fontWeight: 600,
          }}
          itemStyle={{ color: '#E2F4E9' }}
        />
        <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
        <Bar 
          dataKey="Idade Cronológica" 
          fill="#cbd5e1" 
          radius={[4, 4, 0, 0]} 
          name="Id. Cronológica (Meses)"
        />
        <Bar 
          dataKey="Idade Cognitiva" 
          fill="#3b82f6" 
          radius={[4, 4, 0, 0]} 
          name="Id. Desenvolvimento"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// 2. O NOVO GRÁFICO DE RADAR POR ÁREA
export const RadarDevelopmentChart = ({ data }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#E5EDE8" />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: '#46534B', fontSize: 11, fontWeight: 700 }} 
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 'auto']} 
          tick={{ fill: '#A8B7AE', fontSize: 10 }} 
        />
        <Radar
          name="Id. Desenvolvimento"
          dataKey="Idade Cognitiva"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.5}
        />
        <Radar
          name="Id. Cronológica (Meses)"
          dataKey="Idade Cronológica"
          stroke="#cbd5e1"
          fill="#cbd5e1"
          fillOpacity={0.3}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#1D3E2B',
            borderRadius: '12px',
            border: 'none',
            color: '#FFFFFF',
            boxShadow: '0 10px 25px rgba(29, 62, 43, 0.25)',
            fontSize: '12px',
            fontWeight: 600,
          }}
          itemStyle={{ color: '#E2F4E9' }}
        />
        <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
      </RadarChart>
    </ResponsiveContainer>
  );
};