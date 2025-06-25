// src/lib/metricsUtils.js

export const calculateMetricValue = (data, type, category, metric, dateRange, account = null) => {
  if (!data || !Array.isArray(data)) {
    console.log('❌ No data or data is not an array');
    return 0;
  }

  console.log(`🔍 Verificando estructura de datos para:`, { type, category, metric, account });
  console.log(`📅 Rango de fechas:`, dateRange ? 
    `${dateRange.from?.toISOString()} - ${dateRange.to?.toISOString()}` : 'Sin rango');

  const filteredData = data.filter((item) => {
      const itemDate = new Date(item.date);
      const isInDateRange = !dateRange || (itemDate >= dateRange.from && itemDate <= dateRange.to);
      const matchesAccount = account ? item.account === account : true;
      const matchesMetric = item.metric === metric;

      const shouldInclude = item.type === type &&
          item.category === category &&
          matchesMetric &&
          isInDateRange &&
          matchesAccount;

      if (shouldInclude) {
        console.log(`✅ Incluyendo:`, {
          date: item.date,
          value: item.value,
          account: item.account,
          metric: item.metric,
          isInDateRange,
          matchesAccount,
          matchesMetric
        });
      }

      return shouldInclude;
  });

  console.log(`📊 Datos filtrados para ${metric} (${account || 'sin cuenta'}):`, filteredData);

  // Para las métricas de seguidores, devolvemos el valor más reciente en lugar de la suma
  if (metric === 'Seguidores' || metric === 'Total Seguidores') {
    if (filteredData.length === 0) return 0;
    // Ordenamos por fecha descendente y tomamos el primero (más reciente)
    const sortedByDate = [...filteredData].sort((a, b) => new Date(b.date) - new Date(a.date));
    return sortedByDate[0].value;
  }

  // Para todas las demás métricas, sumamos los valores
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