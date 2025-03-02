import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MetricCard from '../ui/MetricCard';
import MetricCardSkeleton from '../ui/MetricCardSkeleton';
import { Button } from "@/components/ui/button";
import { RefreshCw, Pause, Play } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import useMetricsStore from '../../store/metricsStore';
import { calculateMetricValue, transformDataForChart, formatDateForChart } from "@/lib/metricsUtils";

// Componente para el ícono de Google
const GoogleIcon = () => (
 <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
 </svg>
);

// Componente para el ícono de Meta
const MetaIcon = () => (
 <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
   <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" fill="#1877F2"/>
 </svg>
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

const AdsMetrics = ({ dateRange, previousDateRange }) => {
  const { media, fetchMediaMetrics, startAutoRefresh, stopAutoRefresh } = useMetricsStore();
  const { data, isLoading, error, lastUpdated, refreshInterval } = media;
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(!!refreshInterval);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

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
      stopAutoRefresh('media');
      setIsAutoRefreshEnabled(false);
      showToast("Auto-actualización desactivada");
    } else {
      startAutoRefresh('media');
      setIsAutoRefreshEnabled(true);
      showToast("Auto-actualización activada");
    }
  };

  const handleRefresh = async (forceRefresh = false) => {
    setIsRefreshing(true);
    try {
      console.log('Iniciando actualización...');
      const result = await fetchMediaMetrics(dateRange, forceRefresh);
      console.log('Actualización completada:', result);

      if (result) {
        showToast("Datos actualizados correctamente");
      }
    } catch (error) {
      console.error('Error en actualización:', error);
      showToast("Error al actualizar los datos", "destructive");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMediaMetrics(dateRange);
    startAutoRefresh('media');
    setIsAutoRefreshEnabled(true);

    return () => {
      stopAutoRefresh('media');
      setIsAutoRefreshEnabled(false);
    };
  }, [dateRange, fetchMediaMetrics, startAutoRefresh, stopAutoRefresh]);

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
        <section>
          <LoadingSection count={2} />
        </section>
        <section>
          <LoadingSection count={2} />
        </section>
        <section>
          <LoadingSection count={3} />
        </section>
        <section>
          <LoadingSection count={5} />
        </section>
        <section>
          <LoadingSection count={1} />
        </section>
      </div>
    );
  }

 return (
   <div className="space-y-8">
    <MetricsControls 
        onRefresh={handleRefresh}
        onToggleAutoRefresh={handleToggleAutoRefresh}
        isAutoRefreshEnabled={isAutoRefreshEnabled}
        isRefreshing={isRefreshing}
      />

    
     {/* Gastos en Plataformas */}
     <div>
       <h2 className="text-2xl font-bold mb-4">Gastos por Plataforma</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <MetricCard 
            title="Gasto en Google ADS"
            value={calculateMetricValue(data?.data, "Inversión en Medios", "Gastos por Plataforma", "Gasto en Google Ads", dateRange)}
            previousValue={calculateMetricValue(data?.data, "Inversión en Medios", "Gastos por Plataforma", "Gasto en Google Ads", previousDateRange)}
            icon={<GoogleIcon />}
            prefix="$"
          />
          <MetricCard 
            title="Gasto en META Ads"
            value={calculateMetricValue(data?.data, "Inversión en Medios", "Gastos por Plataforma", "Gasto en META Ads", dateRange)}
            previousValue={calculateMetricValue(data?.data, "Inversión en Medios", "Gastos por Plataforma", "Gasto en META Ads", previousDateRange)}
            icon={<MetaIcon />}
            prefix="$"
          />
       </div>

       <Card className="mt-6">
         <CardHeader>
           <CardTitle>Tendencia de Inversión</CardTitle>
         </CardHeader>
         <CardContent>
         <ResponsiveContainer width="100%" height={300}>
  <LineChart data={transformDataForChart(data?.data, "Gastos por Plataforma", ["Gasto en Google Ads", "Gasto en META Ads"])}>
    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
    <XAxis
      dataKey="date"
      tickFormatter={formatDateForChart} // 📌 Formatear fechas a "Ene 24"
    />
    <YAxis />
    <Tooltip
      formatter={(value, name) => [value, name]}
      labelFormatter={(label) => formatDateForChart(label)} // 📌 Formatear etiquetas del tooltip
    />
    <Legend />
    <Line type="monotone" dataKey="Gasto en Google Ads" name="Gasto en Google Ads" stroke="#1a73e8" strokeWidth={2} />
    <Line type="monotone" dataKey="Gasto en META Ads" name="Gasto en META Ads" stroke="#34a853" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>

         </CardContent>
       </Card>
     </div>

     {/* Métricas de Performance */}
     <div>
       <h2 className="text-2xl font-bold mb-4">Métricas de Performance</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <MetricCard 
            title="CTR"
            value={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas de Performance", "CTR", dateRange)}
            previousValue={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas de Performance", "CTR", previousDateRange)}
            icon="🎯"
            suffix="%"
            trendData={transformDataForChart(data?.data, "Métricas de Performance", ["CTR"])
                            .map(item => ({ date: item.date, value: item["CTR"] })) // 🔹 Convertir clave a "value"
                            .slice(-6)}
          />
          <MetricCard 
            title="CPC"
            value={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas de Performance", "CPC", dateRange)}
            previousValue={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas de Performance", "CPC", previousDateRange)}
            icon="💵"
            prefix="$"
            trendData={transformDataForChart(data?.data, "Métricas de Performance", ["CPC"])
              .map(item => ({ date: item.date, value: item["CPC"] })) // 🔹 Convertir clave a "value"
              .slice(-6)}
          />
       </div>

       <Card className="mt-6">
         <CardHeader>
           <CardTitle>Tendencia de Performance</CardTitle>
         </CardHeader>
         <CardContent>
           <ResponsiveContainer width="100%" height={300}>
           <LineChart data={transformDataForChart(data?.data, "Métricas de Performance", ["CTR", "CPC"])}>
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
               <Line type="monotone" dataKey="CTR" name="CTR" stroke="#1a73e8" strokeWidth={2} />
               <Line type="monotone" dataKey="CPC" name="CPC" stroke="#34a853" strokeWidth={2} />
             </LineChart>
           </ResponsiveContainer>
         </CardContent>
       </Card>
     </div>

     {/* Métricas META */}
     <div>
       <h2 className="text-2xl font-bold mb-4">Métricas META</h2>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       <MetricCard 
            title="Alcance en META"
            value={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas META", "Alcance en META", dateRange)}
            previousValue={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas META", "Alcance en META", previousDateRange)}
            icon="📢"
            trendData={transformDataForChart(data?.data, "Métricas META", ["Alcance en META"])
              .map(item => ({ date: item.date, value: item["Alcance en META"] })) // 🔹 Convertir clave a "value"
              .slice(-6)}
          />
          <MetricCard 
            title="Seguimiento Facebook"
            value={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas META", "Seguimiento en Facebook", dateRange)}
            previousValue={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas META", "Seguimiento en Facebook", previousDateRange)}
            icon="👍"
            trendData={transformDataForChart(data?.data, "Métricas META", ["Seguimiento en Facebook"])
              .map(item => ({ date: item.date, value: item["Seguimiento en Facebook"] })) // 🔹 Convertir clave a "value"
              .slice(-6)}
          />
          <MetricCard 
            title="Seguidores Instagram"
            value={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas META", "Seguidores en Instagram", dateRange)}
            previousValue={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas META", "Seguidores en Instagram", previousDateRange)}
            icon="📸"
            trendData={transformDataForChart(data?.data, "Métricas META", ["Seguidores en Instagram"])
              .map(item => ({ date: item.date, value: item["Seguidores en Instagram"] })) // 🔹 Convertir clave a "value"
              .slice(-6)}
          />
       </div>
     </div>

     {/* Métricas de Interacción */}
     <div>
       <h2 className="text-2xl font-bold mb-4">Métricas de Interacción</h2>
       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
       <MetricCard 
            title="Interacciones"
            value={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas de Interacción", "Interacciones", dateRange)}
            previousValue={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas de Interacción", "Interacciones", previousDateRange)}
            icon="🤝"
          />
          <MetricCard 
            title="Comentarios"
            value={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas de Interacción", "Comentarios", dateRange)}
            previousValue={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas de Interacción", "Comentarios", previousDateRange)}
            icon="💬"
          />
          <MetricCard 
            title="Compartidos"
            value={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas de Interacción", "Compartidos", dateRange)}
            previousValue={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas de Interacción", "Compartidos", previousDateRange)}
            icon="🔄"
          />
          <MetricCard 
            title="Reproducciones"
            value={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas de Interacción", "Reproducciones", dateRange)}
            previousValue={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas de Interacción", "Reproducciones", previousDateRange)}
            icon="▶️"
          />
          <MetricCard 
            title="Clicks"
            value={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas de Interacción", "Clicks", dateRange)}
            previousValue={calculateMetricValue(data?.data, "Inversión en Medios", "Métricas de Interacción", "Clicks", previousDateRange)}
            icon="🔗"
          />
       </div>

       <Card className="mt-6">
         <CardHeader>
           <CardTitle>Tendencias de Interacción</CardTitle>
         </CardHeader>
         <CardContent>
           <ResponsiveContainer width="100%" height={300}>
             <LineChart data={transformDataForChart(data?.data, "Métricas de Interacción", ["Interacciones", "Comentarios", "Compartidos", "Reproducciones", , "Clicks"])}>
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
               <Line type="monotone" dataKey="Interacciones" name="Interacciones" stroke="#1a73e8" strokeWidth={2} />
               <Line type="monotone" dataKey="Comentarios" name="Comentarios" stroke="#34a853" strokeWidth={2} />
               <Line type="monotone" dataKey="Compartidos" name="Compartidos" stroke="#ff3300" strokeWidth={2} />
               <Line type="monotone" dataKey="Reproducciones" name="Reproducciones" stroke="#9333ea" strokeWidth={2} />
               <Line type="monotone" dataKey="Clicks" name="Clicks" stroke="#fbbc04" strokeWidth={2} />
             </LineChart>
           </ResponsiveContainer>
         </CardContent>
       </Card>
     </div>

     {/* Registros Club 300 */}
     <div>
        <h2 className="text-2xl font-bold mb-4">Conversiones</h2>
        <div className="grid grid-cols-1 gap-4">
          <MetricCard 
            title="Registros Club 300"
            value={calculateMetricValue(data?.data, "Inversión en Medios", "Conversiones", "Registros Club 300", dateRange)}
            previousValue={calculateMetricValue(data?.data, "Inversión en Medios", "Conversiones", "Registros Club 300", previousDateRange)}
            icon="📝"
          />
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Tendencia de Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              

              <LineChart data={transformDataForChart(data?.data, "Conversiones", ["Registros Club 300"])}>
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
               <Line type="monotone" dataKey="Registros Club 300" name="Registros Club 300" stroke="#1a73e8" strokeWidth={2} />
             </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {lastUpdated && (
        <div className="text-xs text-gray-500 text-right">
          Última actualización: {new Date(lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default AdsMetrics;