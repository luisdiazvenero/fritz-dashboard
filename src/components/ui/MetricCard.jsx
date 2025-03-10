import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip as ChartTooltip } from "recharts";
import { format } from "date-fns";
import { formatDateForChart } from "@/lib/metricsUtils";


const MetricCard = ({ title = "", value, previousValue, icon, prefix = '', suffix = '', trendData = [], barColorClass = "bg-primary" }) => {
  
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
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={trendData} margin={{ top: 0, bottom: -6 }}>
                {/* 📌 Formatear fecha en el eje X */}
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDateForChart} // 🏷️ Formatea fecha a "Ene 25"
                  tick={{ fontSize: 10, dy: 8 }} // 🔹 Tamaño XS
                  axisLine={false} // ❌ Oculta la línea del eje
                  tickLine={false} // ❌ Oculta las líneas de las marcas
                />


                <Bar dataKey="value" fill={computedBarColor} opacity={0.8} radius={[4, 4, 0, 0]}/>

                {/* 📌 Tooltip corregido para eliminar ":" innecesario */}
                <ChartTooltip
                  formatter={(value) => [`${metricName}: ${value.toLocaleString()}`, null]}
                  labelFormatter={(label) => format(new Date(label), "MMM yy")}
                />

              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
