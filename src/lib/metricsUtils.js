// src/lib/metricsUtils.js

export const calculateMetricValue = (data, type, category, metric, dateRange) => {
  if (!data || !Array.isArray(data)) return 0;

  return data
      .filter((item) => {
          const itemDate = new Date(item.date);
          const isInDateRange = !dateRange || (itemDate >= dateRange.from && itemDate <= dateRange.to);
          return (
              item.type === type &&
              item.category === category &&
              item.metric === metric &&
              isInDateRange
          );
      })
      .reduce((sum, item) => sum + item.value, 0);
};


  
export const transformDataForChart = (data, category, metrics) => {
  if (!data || !Array.isArray(data)) return [];

  // 🔹 Agrupar datos por mes
  const groupedByMonth = data
    .filter((item) => item.category === category && metrics.includes(item.metric))
    .reduce((acc, item) => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // 🔹 Formato YYYY-MM

      if (!acc[monthKey]) {
        acc[monthKey] = { date: new Date(date.getFullYear(), date.getMonth(), 1).toISOString() }; // 📌 Usar primer día del mes
        metrics.forEach(metric => acc[monthKey][metric] = 0); // Inicializar métricas en 0
      }

      acc[monthKey][item.metric] += item.value; // 🔄 Sumar valores dentro del mes

      return acc;
    }, {});

  // 🔄 Convertir de objeto a array y ordenar por fecha
  return Object.values(groupedByMonth).sort((a, b) => new Date(a.date) - new Date(b.date));
};


  
  export const formatDateForChart = (dateString) => {
    const date = new Date(dateString);
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    return `${month} ${year}`;
};

  