import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MetricCard from '../ui/MetricCard';
import MetricCardSkeleton from '../ui/MetricCardSkeleton';
import { Button } from "@/components/ui/button";
import { RefreshCw, Pause, Play } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import useMetricsStore from '../../store/metricsStore';
import {
  BarChart3,
  Youtube,
  Instagram,
  Facebook,
  Music2
} from 'lucide-react';
import { calculateMetricValue, transformDataForChart, formatDateForChart } from "@/lib/metricsUtils";


const SectionHeader = ({ icon: Icon, title, subtitle, color }) => (
  <div className="mb-6">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
  </div>
);

const LoadingSection = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array(count).fill(0).map((_, i) => (
      <MetricCardSkeleton key={i} />
    ))}
  </div>
);

const MetricsControls = ({ onRefresh, onToggleAutoRefresh, isAutoRefreshEnabled, isRefreshing }) => (
  <div className="flex items-center gap-2 mb-4">
    <Button
      variant="outline"
      size="sm"
      onClick={() => onRefresh(true)}
      disabled={isRefreshing}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Actualizando...' : 'Actualizar ahora'}
    </Button>

    <Button
      variant="outline"
      size="sm"
      onClick={onToggleAutoRefresh}
    >
      {isAutoRefreshEnabled ? (
        <>
          <Pause className="h-4 w-4 mr-2" />
          Pausar auto-actualización
        </>
      ) : (
        <>
          <Play className="h-4 w-4 mr-2" />
          Iniciar auto-actualización
        </>
      )}
    </Button>
  </div>
);

const SocialMetrics = ({ dateRange, previousDateRange }) => {
  const { social, fetchSocialMetrics, startAutoRefresh, stopAutoRefresh } = useMetricsStore();
  const { data, isLoading, error, lastUpdated, refreshInterval } = social;
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(!!refreshInterval);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const [triggerUpdate, setTriggerUpdate] = useState(false); // 🔹 Nuevo estado agregado


  const showToast = (message, type = "default") => {
    toast({
      title: type === "destructive" ? "Error" : "Notificación",
      description: message,
      duration: 3000,
      variant: type
    });
  };

  const handleToggleAutoRefresh = () => {
    if (isAutoRefreshEnabled) {
      stopAutoRefresh('social');
      setIsAutoRefreshEnabled(false);
      showToast("Auto-actualización desactivada");
    } else {
      startAutoRefresh('social');
      setIsAutoRefreshEnabled(true);
      showToast("Auto-actualización activada");
    }
  };

  const handleRefresh = async (forceRefresh = false) => {
    setIsRefreshing(true);
    try {
      console.log('Iniciando actualización...'); // Debug
      const result = await fetchSocialMetrics(dateRange, forceRefresh);
      console.log('Actualización completada:', result); // Debug

      if (result) {
        showToast("Datos actualizados correctamente");
      }
    } catch (error) {
      console.error('Error en actualización:', error); // Debug
      showToast("Error al actualizar los datos", "destructive");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let isMounted = true; // 🔹 Previene actualizaciones innecesarias si el componente se desmonta
  
    const fetchData = async () => {
      setIsRefreshing(true);
      
      // 🔹 Obtener todas las métricas sociales en una sola llamada
      await fetchSocialMetrics(dateRange);
      
      if (isMounted) {
        setIsRefreshing(false);
      }
    };
  
    fetchData();
  
    startAutoRefresh('social');
    setIsAutoRefreshEnabled(true);
  
    return () => {
      isMounted = false;
      stopAutoRefresh('social');
      setIsAutoRefreshEnabled(false);
    };
  }, [dateRange, fetchSocialMetrics, startAutoRefresh, stopAutoRefresh]);
  

// 🔹 NUEVO useEffect agregado aquí
useEffect(() => {
  if (!isLoading) {
    setTriggerUpdate(prev => !prev); // 🔹 Forzamos actualización cuando termina la carga
  }
}, [isLoading]);

  

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }



  if (isLoading && !data) {
    return (
      <div className="space-y-12">
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <LoadingSection />
        </section>
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <LoadingSection count={3} />
        </section>
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <LoadingSection count={5} />
        </section>
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <LoadingSection count={2} />
        </section>
      </div>
    );
  }

  console.log("🔍 Datos en el store:", JSON.stringify(data, null, 2));

const chileData = data.filter(d => d.account === "fritzchile");
const internationalData = data.filter(d => d.account === "fritzinternational");

console.log("📌 Datos de Instagram Chile en el store:", chileData.length, chileData);
console.log("📌 Datos de Instagram Internacional en el store:", internationalData.length, internationalData);

// Crear un objeto para combinar todos los datos
const combineSocialData = () => {
  const instagramData = transformDataForChart(data, "Instagram", ["Alcance"]);
  const youtubeData = transformDataForChart(data, "YouTube", ["Visualizaciones"]);
  const tiktokData = transformDataForChart(data, "TikTok", ["Visualizaciones de Videos"]);
  const facebookData = transformDataForChart(data, "Facebook", ["Seguidores"]);

  // Crear un mapa para combinar los datos por fecha
  const combinedMap = new Map();

  // Función para procesar y combinar datos
  const processData = (sourceData, key) => {
    sourceData.forEach(item => {
      const date = item.date;
      if (!combinedMap.has(date)) {
        combinedMap.set(date, { date });
      }
      combinedMap.get(date)[key] = item[key];
    });
  };

  // Procesar cada conjunto de datos
  processData(instagramData, "Alcance");
  processData(youtubeData, "Visualizaciones");
  processData(tiktokData, "Visualizaciones de Videos");
  processData(facebookData, "Seguidores");

  // Convertir el mapa a array y ordenar por fecha
  return Array.from(combinedMap.values()).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
};


  return (
    <div className="space-y-12">
      <MetricsControls
        onRefresh={handleRefresh}
        onToggleAutoRefresh={handleToggleAutoRefresh}
        isAutoRefreshEnabled={isAutoRefreshEnabled}
        isRefreshing={isRefreshing}
      />


      {/* Resumen Global */}
      <section className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
        <SectionHeader
          icon={BarChart3}
          title="Resumen de Redes Sociales"
          subtitle="Vista general de todas las plataformas"
          color="bg-blue-500"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <MetricCard
            title="YouTube: Visualizaciones"
            value={calculateMetricValue(data, "Redes Sociales", "YouTube", "Visualizaciones", dateRange)}
            previousValue={calculateMetricValue(data, "Redes Sociales", "YouTube", "Visualizaciones", previousDateRange)}
            icon={<Youtube className="h-6 w-6 text-red-500" />}
            trendData={transformDataForChart(data, "YouTube", ["Visualizaciones"])
              .map(item => ({ date: item.date, value: item["Visualizaciones"] })) // 🔹 Cambiar clave a "value"
              .slice(-6)}
              barColorClass="bg-red-500"
          />
          
          <MetricCard
  title="Instagram: Alcance"
  value={calculateMetricValue(data, "Redes Sociales", "Instagram", "Alcance", dateRange)}
  previousValue={calculateMetricValue(data, "Redes Sociales", "Instagram", "Alcance", previousDateRange)}
  icon={<Instagram className="h-6 w-6 text-purple-500" />}
  trendData={transformDataForChart(data, "Instagram", ["Alcance"])
    .map(item => ({ date: item.date, value: item["Alcance"] }))
    .slice(-6)}
  barColorClass="bg-purple-700"
/>





<MetricCard
  title="TikTok: Visualizaciones"
  value={calculateMetricValue(data, "Redes Sociales", "TikTok", "Visualizaciones de Videos", dateRange)}
  previousValue={calculateMetricValue(data, "Redes Sociales", "TikTok", "Visualizaciones de Videos", previousDateRange)}
  icon={<Music2 className="h-6 w-6 text-black-500" />}
  trendData={transformDataForChart(data, "TikTok", ["Visualizaciones de Videos"])
    .map(item => ({ date: item.date, value: item["Visualizaciones de Videos"] })) // 🔹 Convertir clave a "value"
    .slice(-6)}
/>
<MetricCard
  title="Facebook: Seguidores"
  value={calculateMetricValue(data, "Redes Sociales", "Facebook", "Seguidores", dateRange)}
  previousValue={calculateMetricValue(data, "Redes Sociales", "Facebook", "Seguidores", previousDateRange)}
  icon={<Facebook className="h-6 w-6 text-blue-500" />}
  trendData={transformDataForChart(data, "Facebook", ["Seguidores"])
    .map(item => ({ date: item.date, value: item["Seguidores"] })) // 🔹 Convertir clave a "value"
    .slice(-6)}
    barColorClass="bg-blue-700"
/>
        </div>

        
<Card className="border-none shadow-sm">
  <CardHeader>
    <CardTitle className="text-lg text-gray-700">Tendencia de Redes Sociales</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={combineSocialData()}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDateForChart}
        />
        <YAxis />
        <Tooltip
          formatter={(value, name, props) => [value, name]}
          labelFormatter={(label) => formatDateForChart(label)}
        />
        <Legend />
        
        <Line 
          type="monotone" 
          dataKey="Alcance" 
          name="📸 Instagram: Alcance" 
          stroke="#833AB4" 
          strokeWidth={2} 
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="Visualizaciones" 
          name="📺 YouTube: Visualizaciones" 
          stroke="#FF0000" 
          strokeWidth={2} 
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="Visualizaciones de Videos" 
          name="🎵 TikTok: Visualizaciones" 
          stroke="#000000" 
          strokeWidth={2} 
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="Seguidores" 
          name="👍 Facebook: Seguidores" 
          stroke="#1877F2" 
          strokeWidth={2} 
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
        
      </section>

      <Separator className="my-8" />

      {/* YouTube */}
      <section className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-600">
        <SectionHeader
          icon={Youtube}
          title="YouTube"
          subtitle="@SALSASFRITZ"
          color="bg-red-600"
        />
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
  title="Nuevos Videos"
  value={calculateMetricValue(data, "Redes Sociales", "YouTube", "Nuevos Videos", dateRange)}
  previousValue={calculateMetricValue(data, "Redes Sociales", "YouTube", "Nuevos Videos", previousDateRange)}
  icon="🎥"
  trendData={transformDataForChart(data, "YouTube", ["Nuevos Videos"])
    .map(item => ({ date: item.date, value: item["Nuevos Videos"] }))
    .slice(-6)} 
    
/>
<MetricCard
  title="Nuevos Suscriptores"
  value={calculateMetricValue(data, "Redes Sociales", "YouTube", "Nuevos Suscriptores", dateRange)}
  previousValue={calculateMetricValue(data, "Redes Sociales", "YouTube", "Nuevos Suscriptores", previousDateRange)}
  icon="👥"
  trendData={transformDataForChart(data, "YouTube", ["Nuevos Suscriptores"])
    .map(item => ({ date: item.date, value: item["Nuevos Suscriptores"] }))
    .slice(-6)}
    
/>
<MetricCard
  title="Visualizaciones"
  value={calculateMetricValue(data, "Redes Sociales", "YouTube", "Visualizaciones", dateRange)}
  previousValue={calculateMetricValue(data, "Redes Sociales", "YouTube", "Visualizaciones", previousDateRange)}
  icon="👁️"
  trendData={transformDataForChart(data, "YouTube", ["Visualizaciones"])
    .map(item => ({ date: item.date, value: item["Visualizaciones"] }))
    .slice(-6)}
    
/>
          </div>




        </div>
      </section>

      <Separator className="my-8" />

      {/* Instagram Venezuela*/}
      <section className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-600">
        <SectionHeader
          icon={Instagram}
          title="@fritzvenezuela"
          subtitle="🇻🇪 Instagram"
          color="bg-purple-600"
        />
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <MetricCard
              title="Total Seguidores"
              value={calculateMetricValue(data, "Redes Sociales", "Instagram", "Seguidores", dateRange, "fritzvenezuela")}
              previousValue={calculateMetricValue(data, "Redes Sociales", "Instagram", "Seguidores", previousDateRange, "fritzvenezuela")}
              icon="👥"
              trendData={transformDataForChart(data, "Instagram", ["Seguidores"])
                .map(item => ({ date: item.date, value: item["Seguidores"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
                //barColorClass="bg-purple-700"
            />
            <MetricCard
              title="Nuevos Followers"
              value={calculateMetricValue(data, "Redes Sociales", "Instagram", "Nuevos Seguidores", dateRange, "fritzvenezuela")}
              previousValue={calculateMetricValue(data?.data, "Redes Sociales", "Instagram", "Nuevos Seguidores", previousDateRange, "fritzvenezuela")}
              icon="✨"
              trendData={transformDataForChart(data, "Instagram", ["Nuevos Seguidores"])
                .map(item => ({ date: item.date, value: item["Nuevos Seguidores"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
                //barColorClass="bg-purple-700"
            />
            <MetricCard
              title="Impresiones"
              value={calculateMetricValue(data, "Redes Sociales", "Instagram", "Impresiones", dateRange, "fritzvenezuela")}
              previousValue={calculateMetricValue(data, "Redes Sociales", "Instagram", "Impresiones", previousDateRange, "fritzvenezuela")}
              icon="👁️"
              trendData={transformDataForChart(data, "Instagram", ["Impresiones"])
                .map(item => ({ date: item.date, value: item["Impresiones"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
                //barColorClass="bg-purple-700"
            />
            <MetricCard
              title="Alcance"
              value={calculateMetricValue(data, "Redes Sociales", "Instagram", "Alcance", dateRange, "fritzvenezuela")}
              previousValue={calculateMetricValue(data, "Redes Sociales", "Instagram", "Alcance", previousDateRange, "fritzvenezuela")}
              icon="📢"
              trendData={transformDataForChart(data, "Instagram", ["Alcance"])
                .map(item => ({ date: item.date, value: item["Alcance"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
                //barColorClass="bg-purple-700"
            />
            <MetricCard
              title="Interacciones"
              value={calculateMetricValue(data, "Redes Sociales", "Instagram", "Interacciones", dateRange, "fritzvenezuela")}
              previousValue={calculateMetricValue(data?.data, "Redes Sociales", "Instagram", "Interacciones", previousDateRange, "fritzvenezuela")}
              icon="❤️"
              trendData={transformDataForChart(data, "Instagram", ["Interacciones"])
                .map(item => ({ date: item.date, value: item["Interacciones"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
                //barColorClass="bg-purple-700"
            />
          </div>

        </div>
      </section>

      {/* Instagram Chile*/}
      <section className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-600">
        <SectionHeader
          icon={Instagram}
          title="@fritzchile"
          subtitle="🇨🇱 Instagram"
          color="bg-purple-600"
        />
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetricCard
  title="Total Seguidores"
  value={
    (() => {
      console.log(`✅ Pasando account a calculateMetricValue: fritzchile`);
      return calculateMetricValue(data, "Redes Sociales", "Instagram", "Seguidores", dateRange, "fritzchile");
    })()
  }
  previousValue={calculateMetricValue(data, "Redes Sociales", "Instagram", "Seguidores", previousDateRange, "fritzchile")}
  icon="👥"
  trendData={transformDataForChart(data, "Instagram", ["Seguidores"], "fritzchile")
    .map(item => ({ date: item.date, value: item["Seguidores"] }))
    .slice(-6)}
/>

            <MetricCard
              title="Nuevos Followers"
              value={calculateMetricValue(data, "Redes Sociales", "Instagram", "Nuevos Seguidores", dateRange, "fritzchile")}
              previousValue={calculateMetricValue(data, "Redes Sociales", "Instagram", "Nuevos Seguidores", previousDateRange, "fritzchile")}
              icon="✨"
              trendData={transformDataForChart(data, "Instagram", ["Nuevos Seguidores"], "fritzchile")
                .map(item => ({ date: item.date, value: item["Nuevos Seguidores"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
                //barColorClass="bg-purple-700"
            />
            <MetricCard
              title="Impresiones"
              value={calculateMetricValue(data, "Redes Sociales", "Instagram", "Impresiones", dateRange, "fritzchile")}
              previousValue={calculateMetricValue(data, "Redes Sociales", "Instagram", "Impresiones", previousDateRange, "fritzchile")}
              icon="👁️"
              trendData={transformDataForChart(data, "Instagram", ["Impresiones"], "fritzchile")
                .map(item => ({ date: item.date, value: item["Impresiones"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
                //barColorClass="bg-purple-700"
            />
            <MetricCard
              title="Alcance"
              value={calculateMetricValue(data, "Redes Sociales", "Instagram", "Alcance", dateRange, "fritzchile")}
              previousValue={calculateMetricValue(data, "Redes Sociales", "Instagram", "Alcance", previousDateRange, "fritzchile")}
              icon="📢"
              trendData={transformDataForChart(data, "Instagram", ["Alcance"], "fritzchile")
                .map(item => ({ date: item.date, value: item["Alcance"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
                //barColorClass="bg-purple-700"
            />
            <MetricCard
              title="Interacciones"
              value={calculateMetricValue(data, "Redes Sociales", "Instagram", "Interacciones", dateRange, "fritzchile")}
              previousValue={calculateMetricValue(data, "Redes Sociales", "Instagram", "Interacciones", previousDateRange, "fritzchile")}
              icon="❤️"
              trendData={transformDataForChart(data, "Instagram", ["Interacciones"], "fritzchile")
                .map(item => ({ date: item.date, value: item["Interacciones"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
                //barColorClass="bg-purple-700"
            />
          </div>

        </div>
      </section>

      {/* Instagram International*/}
      <section className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-600">
        <SectionHeader
          icon={Instagram}
          title="@fritzinternational"
          subtitle="🏴 Instagram"
          color="bg-purple-600"
        />
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <MetricCard
              title="Total Seguidores"
              value={calculateMetricValue(data, "Redes Sociales", "Instagram", "Seguidores", dateRange, "fritzinternational")}
              previousValue={calculateMetricValue(data, "Redes Sociales", "Instagram", "Seguidores", previousDateRange, "fritzinternational")}
              icon="👥"
              trendData={transformDataForChart(data, "Instagram", ["Seguidores"], "fritzinternational")
                .map(item => ({ date: item.date, value: item["Seguidores"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
                //barColorClass="bg-purple-700"
            />
            <MetricCard
              title="Nuevos Followers"
              value={calculateMetricValue(data, "Redes Sociales", "Instagram", "Nuevos Seguidores", dateRange, "fritzinternational")}
              previousValue={calculateMetricValue(data, "Redes Sociales", "Instagram", "Nuevos Seguidores", previousDateRange, "fritzinternational")}
              icon="✨"
              trendData={transformDataForChart(data, "Instagram", ["Nuevos Seguidores"], "fritzinternational")
                .map(item => ({ date: item.date, value: item["Nuevos Seguidores"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
                //barColorClass="bg-purple-700"
            />
            <MetricCard
              title="Impresiones"
              value={calculateMetricValue(data, "Redes Sociales", "Instagram", "Impresiones", dateRange, "fritzinternational")}
              previousValue={calculateMetricValue(data, "Redes Sociales", "Instagram", "Impresiones", previousDateRange, "fritzinternational")}
              icon="👁️"
              trendData={transformDataForChart(data, "Instagram", ["Impresiones"], "fritzinternational")
                .map(item => ({ date: item.date, value: item["Impresiones"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
                //barColorClass="bg-purple-700"
            />
            <MetricCard
              title="Alcance"
              value={calculateMetricValue(data, "Redes Sociales", "Instagram", "Alcance", dateRange, "fritzinternational")}
              previousValue={calculateMetricValue(data, "Redes Sociales", "Instagram", "Alcance", previousDateRange, "fritzinternational")}
              icon="📢"
              trendData={transformDataForChart(data, "Instagram", ["Alcance"], "fritzinternational")
                .map(item => ({ date: item.date, value: item["Alcance"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
                //barColorClass="bg-purple-700"
            />
            <MetricCard
              title="Interacciones"
              value={calculateMetricValue(data, "Redes Sociales", "Instagram", "Interacciones", dateRange, "fritzinternational")}
              previousValue={calculateMetricValue(data, "Redes Sociales", "Instagram", "Interacciones", previousDateRange, "fritzinternational")}
              icon="❤️"
              trendData={transformDataForChart(data, "Instagram", ["Interacciones"], "fritzinternational")
                .map(item => ({ date: item.date, value: item["Interacciones"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
                //barColorClass="bg-purple-700"
            />
          </div>

        </div>
      </section>

      <Separator className="my-8" />

      {/* TikTok */}
      <section className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-black">
        <SectionHeader
          icon={Music2}
          title="TikTok"
          subtitle="@fritzvenezuela"
          color="bg-black"
        />
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              title="Nuevos Followers"
              value={calculateMetricValue(data, "Redes Sociales", "TikTok", "Nuevos Seguidores", dateRange)}
              previousValue={calculateMetricValue(data, "Redes Sociales", "TikTok", "Nuevos Seguidores", previousDateRange)}
              icon="✨"
              trendData={transformDataForChart(data, "TikTok", ["Nuevos Seguidores"])
                .map(item => ({ date: item.date, value: item["Nuevos Seguidores"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
            />
            <MetricCard
              title="Seguidores Netos"
              value={calculateMetricValue(data, "Redes Sociales", "TikTok", "Seguidores Netos", dateRange)}
              previousValue={calculateMetricValue(data?.data, "Redes Sociales", "TikTok", "Seguidores Netos", previousDateRange)}
              icon="👥"
              trendData={transformDataForChart(data, "TikTok", ["Seguidores Netos"])
                .map(item => ({ date: item.date, value: item["Seguidores Netos"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
            />
            <MetricCard
              title="Visualizaciones Videos"
              value={calculateMetricValue(data, "Redes Sociales", "TikTok", "Visualizaciones de Videos", dateRange)}
              previousValue={calculateMetricValue(data, "Redes Sociales", "TikTok", "Visualizaciones de Videos", previousDateRange)}
              icon="👁️"
              trendData={transformDataForChart(data, "TikTok", ["Visualizaciones de Videos"])
                .map(item => ({ date: item.date, value: item["Visualizaciones de Videos"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
            />
            <MetricCard
              title="Visualizaciones Perfil"
              value={calculateMetricValue(data, "Redes Sociales", "TikTok", "Visualizaciones de Perfil", dateRange)}
              previousValue={calculateMetricValue(data, "Redes Sociales", "TikTok", "Visualizaciones de Perfil", previousDateRange)}
              icon="👤"
              trendData={transformDataForChart(data, "TikTok", ["Visualizaciones de Perfil"])
                .map(item => ({ date: item.date, value: item["Visualizaciones de Perfil"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
            />
            <MetricCard
              title="Me gusta"
              value={calculateMetricValue(data, "Redes Sociales", "TikTok", "Me gusta", dateRange)}
              previousValue={calculateMetricValue(data, "Redes Sociales", "TikTok", "Me gusta", previousDateRange)}
              icon="❤️"
              trendData={transformDataForChart(data, "TikTok", ["Me gusta"])
                .map(item => ({ date: item.date, value: item["Me gusta"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
            />
            <MetricCard
              title="Compartidos"
              value={calculateMetricValue(data, "Redes Sociales", "TikTok", "Compartidos", dateRange)}
              previousValue={calculateMetricValue(data, "Redes Sociales", "TikTok", "Compartido", previousDateRange)}
              icon="🔄"
              trendData={transformDataForChart(data, "TikTok", ["Compartidos"])
                .map(item => ({ date: item.date, value: item["Compartidos"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
            />
          </div>



        </div>
      </section>

      <Separator className="my-8" />

      {/* Facebook */}
      <section className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
        <SectionHeader
          icon={Facebook}
          title="Facebook"
          subtitle="Fritz Venezuela"
          color="bg-blue-600"
        />
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Total Seguidores"
              value={calculateMetricValue(data, "Redes Sociales", "Facebook", "Seguidores", dateRange)}
              previousValue={calculateMetricValue(data, "Redes Sociales", "Facebook", "Seguidores", previousDateRange)}
              icon="👥"
              trendData={transformDataForChart(data, "Facebook", ["Seguidores"])
                .map(item => ({ date: item.date, value: item["Seguidores"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
                //barColorClass="bg-blue-700"
            />
            <MetricCard
              title="Nuevos Followers"
              value={calculateMetricValue(data, "Redes Sociales", "Facebook", "Nuevos Seguidores", dateRange)}
              previousValue={calculateMetricValue(data, "Redes Sociales", "Facebook", "Nuevos Seguidores", previousDateRange)}
              icon="✨"
              trendData={transformDataForChart(data, "Facebook", ["Nuevos Seguidores"])
                .map(item => ({ date: item.date, value: item["Nuevos Seguidores"] })) // 🔹 Convertir clave a "value"
                .slice(-6)}
                //barColorClass="bg-blue-700"
            />
          </div>

{/* Grafico
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Crecimiento de Seguidores</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={transformDataForChart(data?.data, "Facebook", ["Seguidores", "Nuevos Seguidores"])}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDateForChart} // Formatear las fechas
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name, props) => [value, name]}
                    labelFormatter={(label) => formatDateForChart(label)} // Formatear las etiquetas
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Seguidores" name="Seguidores" stroke="#1a73e8" strokeWidth={2} />
                  <Line type="monotone" dataKey="Nuevos Seguidores" name="Nuevos Seguidores" stroke="#34a853" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          */}
        </div>
      </section>

      {lastUpdated && (
        <div className="text-xs text-gray-500 text-right">
          Última actualización: {new Date(lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default SocialMetrics;