import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, LineChart, Bar, Line, XAxis, YAxis, Tooltip as ChartTooltip } from "recharts";
import { format } from 'date-fns';

const MetricCard = ({ 
  title, 
  value, 
  previousValue, 
  icon, 
  prefix = '', 
  suffix = '', 
  trendData = [], 
  barColorClass = "bg-primary",
  chartType = 'bar' 
}) => {
  const percentageChange = previousValue ? ((value - previousValue) / previousValue * 100).toFixed(1) : 0;
  const isPositive = value > previousValue;

  // Obtener el color de la barra
  const getComputedColor = (className) => {
    const el = document.createElement("div");
    el.className = className;
    document.body.appendChild(el);
    const color = window.getComputedStyle(el).backgroundColor;
    document.body.removeChild(el);
    return color;
  };

  const computedBarColor = getComputedColor(barColorClass);

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
        {previousValue !== undefined && (
          <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center gap-1 mt-1`}>
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(percentageChange)}%</span>
            <span className="text-muted-foreground ml-1">vs anterior</span>
          </div>
        )}
        {trendData.length > 0 && (
          <div className="w-full mt-2">
            {title === 'Total Seguidores' && console.log('📊 Trend Data for', title, ':', JSON.parse(JSON.stringify(trendData)))}
            <ResponsiveContainer width="100%" height={80}>
              {chartType === 'line' ? (
                <LineChart data={trendData}>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'MMM yy')}
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Line 
                    type="linear"
                    dataKey="value"
                    stroke={computedBarColor}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                    connectNulls={false}
                  />
                  <ChartTooltip 
                    formatter={(value) => [`${value.toLocaleString()}`, '']}
                    labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                  />
                </LineChart>
              ) : (
                <BarChart data={trendData}>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'MMM yy')}
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar 
                    dataKey="value" 
                    fill={computedBarColor} 
                    opacity={0.8} 
                    radius={[4, 4, 0, 0]}
                  />
                  <ChartTooltip 
                    formatter={(value) => [`${value.toLocaleString()}`, '']}
                    labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
