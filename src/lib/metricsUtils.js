// src/lib/metricsUtils.js

export const calculateMetricValue = (data, type, category, metric, dateRange, account = null) => {
  if (!data || !Array.isArray(data)) return 0;

  console.log(`🔍 Verificando estructura de datos recibidos:`, data);

  const filteredData = data.filter((item) => {
      const itemDate = new Date(item.date);
      const isInDateRange = !dateRange || (itemDate >= dateRange.from && itemDate <= dateRange.to);
      const matchesAccount = account ? item.account === account : true; // 🔹 Filtra por cuenta si está definida

      // 🔍 Nuevo log para ver cada métrica antes de filtrarla
      console.log(`🛠 Evaluando item - account: ${item.account}, type: ${item.type}, category: ${item.category}, metric: ${item.metric}`);

      return (
          item.type === type &&
          item.category === category &&
          item.metric === metric &&
          isInDateRange &&
          matchesAccount
      );
  });

  console.log(`✅ Datos filtrados para account=${account}:`, filteredData);

  return filteredData.reduce((sum, item) => sum + item.value, 0);
};



export const transformDataForChart = (data, category, metrics, account = null) => {
  if (!data || !Array.isArray(data)) return [];

  // 🔹 Agrupar datos por mes
  const groupedByMonth = data
    .filter((item) => 
      item.category === category &&
      metrics.includes(item.metric) &&
      (!account || item.account === account) // 🔹 Filtrar por cuenta si está definida
    )
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
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Asegura 2 dígitos
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${year}`;
  };