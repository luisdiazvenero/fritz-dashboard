import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip } from "recharts";


const MetricCard = ({ title, value, previousValue, icon, prefix = '', suffix = '', trendData = [] }) => {
  const percentageChange = ((value - previousValue) / previousValue * 100).toFixed(1);
  const isPositive = value > previousValue;

  
  

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            {icon && <span className="text-xl">{icon}</span>}
            {title}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix}{value.toLocaleString()}{suffix}
        </div>
        <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center gap-1 mt-1`}>
          <span>{isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(percentageChange)}%</span>
          <span className="text-muted-foreground ml-1">vs anterior</span>
        </div>
        {trendData.length > 0 && (
          <div className="w-full mt-2">
          <ResponsiveContainer width="100%" height={50}>  // Ajuste dinámico
            <BarChart data={tempData}>
              <Bar dataKey="value" fill="currentColor" opacity={0.8} />
              <ChartTooltip />
            </BarChart>
          </ResponsiveContainer>
        </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
