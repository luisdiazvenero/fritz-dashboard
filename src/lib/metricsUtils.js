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
  
    const groupedByDate = data
      .filter((item) => item.category === category && metrics.includes(item.metric))
      .reduce((acc, item) => {
        const date = item.date.split("T")[0];
        if (!acc[date]) {
          acc[date] = { date };
        }
        acc[date][item.metric] = (acc[date][item.metric] || 0) + item.value;
        return acc;
      }, {});
  
    return Object.values(groupedByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
  };
  
  export const formatDateForChart = (dateString) => {
    const date = new Date(dateString);
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    return `${month} ${year}`;
};

  