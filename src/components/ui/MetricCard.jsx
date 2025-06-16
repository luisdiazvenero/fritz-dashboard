import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, LineChart, Bar, Line, XAxis, Tooltip as ChartTooltip } from "recharts";
import { format } from "date-fns";
import { formatDateForChart } from "@/lib/metricsUtils";


const MetricCard = ({ title = "", value, previousValue, icon, prefix = '', suffix = '', trendData = [], barColorClass = "bg-primary", chartType = 'bar' }) => {
  
  const percentageChange = previousValue
    ? ((value - previousValue) / previousValue * 100).toFixed(1)
    : 0;
  const isPositive = value > previousValue;

  // ✅ Asegurar que title siempre sea un string antes de usar .includes()
  const titleString = String(title);
  const metricName = titleString.includes(": ") ? titleString.split(": ")[1].trim() : titleString.trim();

    // 🎨 Convertir Tailwind class a valor hexadecimal
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
        <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center gap-1 mt-1`}>
          <span>{isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(percentageChange)}%</span>
          <span className="text-muted-foreground ml-1">vs anterior</span>
        </div>

        {/* 📊 Renderizar BarChart solo si hay datos */}
        {trendData.length > 0 && (
          <div className="w-full mt-2">
            <ResponsiveContainer width="100%" height={120}>
              {chartType === 'line' ? (
                <LineChart data={trendData} margin={{ top: 5, bottom: -6 }}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDateForChart}
                    tick={{ fontSize: 10, dy: 8 }}
                    axisLine={false}
                    tickLine={false}
                    //interval={0}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={computedBarColor} 
                    strokeWidth={2}
                    dot={false}
                    strokeLinecap="round"
                  />
                  <ChartTooltip
                    formatter={(value) => [`${metricName}: ${value.toLocaleString()}`, null]}
                    labelFormatter={(label) => format(new Date(label), "MMM yy")}
                  />
                </LineChart>
              ) : (
                <BarChart data={trendData} margin={{ top: 0, bottom: -6 }}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDateForChart}
                    tick={{ fontSize: 10, dy: 8 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar dataKey="value" fill={computedBarColor} opacity={0.8} radius={[4, 4, 0, 0]} />
                  <ChartTooltip
                    formatter={(value) => [`${metricName}: ${value.toLocaleString()}`, null]}
                    labelFormatter={(label) => format(new Date(label), "MMM yy")}
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
