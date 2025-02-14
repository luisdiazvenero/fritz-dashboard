import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MetricCard from '../ui/MetricCard';
import MetricCardSkeleton from '../ui/MetricCardSkeleton';
import { Button } from "@/components/ui/button";
import { RefreshCw, Pause, Play } from 'lucide-react';
import { BarChart3, Globe2, Users } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import useMetricsStore from '../../store/metricsStore';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { calculateMetricValue, transformDataForChart, formatDateForChart } from "@/lib/metricsUtils";

const calculateTotalFritz = (data, dateRange) => {
  if (!data || !Array.isArray(data)) return 0;

  const metricsToSum = [
    "Home Venezuela",
    "Home Peru",
    "Home Chile",
    "Home Usa",
    "Contacto Venezuela",
    "Contacto Peru",
    "Contacto Chile",
    "Contacto Usa",
    "Nuevos Fritz Lover",
    "Pagina Sorpresas",
    "Clic en Jugar"
  ];

  return data
    .filter((item) => {
      const itemDate = new Date(item.date);
      const isInDateRange = !dateRange || (itemDate >= dateRange.from && itemDate <= dateRange.to);
      return (
        item.type === "Web" &&
        item.category === "Fritz International" &&
        metricsToSum.includes(item.metric) &&
        isInDateRange
      );
    })
    .reduce((sum, item) => sum + item.value, 0);
};


const calculateTotalClub300 = (data, dateRange) => {
  if (!data || !Array.isArray(data)) return 0;

  const metricsToSum = [
    "Home Club300",
    "Pagina Registro",
    "Pagina Galeria",
    "Otras Paginas"
  ];

  return data
    .filter((item) => {
      const itemDate = new Date(item.date);
      const isInDateRange = !dateRange || (itemDate >= dateRange.from && itemDate <= dateRange.to);
      return (
        item.type === "Web" &&
        item.category === "Club300" &&
        metricsToSum.includes(item.metric) &&
        isInDateRange
      );
    })
    .reduce((sum, item) => sum + item.value, 0);
};




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

const LoadingSection = ({ count = 5 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
    {Array(count).fill(0).map((_, i) => (
      <MetricCardSkeleton key={i} />
    ))}
  </div>
);

// MetricsControls modificado
const MetricsControls = ({ onRefresh, onToggleAutoRefresh, isAutoRefreshEnabled, isRefreshing, showToast }) => (
  <div className="flex items-center gap-2 mb-4">
    <Button
      variant="outline"
      size="sm"
      onClick={() => onRefresh(true)}
      disabled={isRefreshing}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Actualizando...' : 'Actualizar'}
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

const WebMetrics = ({ dateRange, previousDateRange }) => {
  const { web, fetchWebMetrics, media, fetchMediaMetrics, startAutoRefresh, stopAutoRefresh } = useMetricsStore();
  const { data, isLoading, error, lastUpdated, refreshInterval } = web;
  const { mediaData, isMediaLoading, mediaError, mediaLastUpdated, mediaRefreshInterval } = media;
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(!!refreshInterval);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();


  // Primero definimos showToast
  const showToast = (message, type = "default") => {
    console.log('Llamando showToast con:', message); // Debug
    toast({
      title: type === "destructive" ? "Error" : "Notificación",
      description: message,
      duration: 3000,
      variant: type
    });
  };

  // Luego lo usamos en handleToggleAutoRefresh
  const handleToggleAutoRefresh = () => {
    if (isAutoRefreshEnabled) {
      stopAutoRefresh('web');
      setIsAutoRefreshEnabled(false);
      showToast("Auto-actualización desactivada");
    } else {
      startAutoRefresh('web');
      setIsAutoRefreshEnabled(true);
      showToast("Auto-actualización activada");
    }
  };



  const handleRefresh = async (forceRefresh = false) => {
    setIsRefreshing(true);
    try {
      console.log('Iniciando actualización...');
      const result = await fetchWebMetrics(dateRange, forceRefresh);
      console.log('Actualización completada:', result);

      // Solo mostrar el toast si hay datos o un resultado
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
    fetchWebMetrics(dateRange);
    startAutoRefresh('web');
    fetchMediaMetrics(dateRange);
    startAutoRefresh('media');
    setIsAutoRefreshEnabled(true);

    return () => {
      stopAutoRefresh('web');
      stopAutoRefresh('media');
      setIsAutoRefreshEnabled(false);
    };
  }, [dateRange, fetchWebMetrics, fetchMediaMetrics, startAutoRefresh, stopAutoRefresh]);

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
          <LoadingSection count={4} />
        </section>
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <LoadingSection count={4} />
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <MetricsControls
        onRefresh={handleRefresh}
        onToggleAutoRefresh={handleToggleAutoRefresh}
        isAutoRefreshEnabled={isAutoRefreshEnabled}
        isRefreshing={isRefreshing}
        showToast={showToast}
      />

      {/* Métricas Globales */}
      <section className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
        <SectionHeader
          icon={BarChart3}
          title="Métricas Globales"
          subtitle="Resumen general de todas las plataformas web"
          color="bg-blue-500"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            title="Totales Fritz"
            value={calculateTotalFritz(data?.data, dateRange)}
            previousValue={0} // Este puede calcularse si tienes datos históricos similares
            icon={<Globe2 className="h-6 w-6 text-blue-500" />}
          />
          <MetricCard
            title="Total Club 300"
            value={calculateTotalClub300(data?.data, dateRange)}
            previousValue={0} // Puedes calcular datos previos si tienes históricos
            icon={Users}
            title="Club 300"
            subtitle="club300fritz.com"

            icon={<Users className="h-6 w-6 text-blue-500" />}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <MetricCard
            title="Nuevos Fritz Lovers"
            value={calculateMetricValue(data?.data, "Web", "Fritz International", "Nuevos Fritz Lover", dateRange)}
            previousValue={calculateMetricValue(data?.data, "Web", "Fritz International", "Nuevos Fritz Lover", previousDateRange)}
            icon="❤️"
          />
          <MetricCard
            title="Registros Club 300"
            value={calculateMetricValue(media?.data?.data, "Inversión en Medios", "Conversiones", "Registros Club 300", dateRange)}
            previousValue={calculateMetricValue(media?.data.data, "Inversión en Medios", "Conversiones", "Registros Club 300", previousDateRange)}
            icon="📝"
          />
          <MetricCard
            title="Pagina Sorpresas"
            value={calculateMetricValue(data?.data, "Web", "Fritz International", "Pagina Sorpresas", dateRange)}
            previousValue={calculateMetricValue(data?.data, "Web", "Fritz International", "Pagina Sorpresas", previousDateRange)}
            icon="🎁"
          />

          <MetricCard
            title="Click en Jugar"
            value={calculateMetricValue(data?.data, "Web", "Fritz International", "Clic en Jugar", dateRange)}
            previousValue={calculateMetricValue(data?.data, "Web", "Fritz International", "Clic en Jugar", previousDateRange)}
            icon="🎮"
          />
        </div>
      </section>


      <Separator className="my-8" />

      {/* Fritz International */}
      <section className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-600">
        <SectionHeader
          icon={Globe2}
          title="Fritz International"
          subtitle="fritzinternational.us"
          color="bg-red-600"
        />

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Páginas Principales</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard
                title={<div className="flex items-center gap-2">🇻🇪 Venezuela</div>}
                value={calculateMetricValue(data?.data, "Web", "Fritz International", "Home Venezuela", dateRange)}
                previousValue={calculateMetricValue(data?.data, "Web", "Fritz International", "Home Venezuela", previousDateRange)}
              />
              <MetricCard
                title={<div className="flex items-center gap-2">🇵🇪 Perú</div>}
                value={calculateMetricValue(data?.data, "Web", "Fritz International", "Home Peru", dateRange)}
                previousValue={calculateMetricValue(data?.data, "Web", "Fritz International", "Home Peru", previousDateRange)}
              />
              <MetricCard
                title={<div className="flex items-center gap-2">🇨🇱 Chile</div>}
                value={calculateMetricValue(data?.data, "Web", "Fritz International", "Home Chile", dateRange)}
                previousValue={calculateMetricValue(data?.data, "Web", "Fritz International", "Home Chile", previousDateRange)}
              />
              <MetricCard
                title={<div className="flex items-center gap-2">🇺🇸 USA</div>}
                value={calculateMetricValue(data?.data, "Web", "Fritz International", "Home Usa", dateRange)}
                previousValue={calculateMetricValue(data?.data, "Web", "Fritz International", "Home Usa", previousDateRange)}
              />
            </div>
          </div>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-700">Tendencia de Visitas por País</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={transformDataForChart(data?.data, "Fritz International", ["Home Venezuela", "Home Peru", "Home Chile", "Home Usa"])}>
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
                  <Line type="monotone" dataKey="Home Venezuela" name="🇻🇪 Venezuela" stroke="#1a73e8" strokeWidth={2} />
                  <Line type="monotone" dataKey="Home Peru" name="🇵🇪 Perú" stroke="#34a853" strokeWidth={2} />
                  <Line type="monotone" dataKey="Home Chile" name="🇨🇱 Chile" stroke="#fbbc04" strokeWidth={2} />
                  <Line type="monotone" dataKey="Home Usa" name="🇺🇸 USA" stroke="#ea4335" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Páginas de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard
                title={<div className="flex items-center gap-2">🇻🇪 Contacto</div>}
                value={calculateMetricValue(data?.data, "Web", "Fritz International", "Contacto Venezuela", dateRange)}
                previousValue={calculateMetricValue(data?.data, "Web", "Fritz International", "Contacto Venezuela", previousDateRange)}
              />
              <MetricCard
                title={<div className="flex items-center gap-2">🇵🇪 Contacto</div>}
                value={calculateMetricValue(data?.data, "Web", "Fritz International", "Contacto Peru", dateRange)}
                previousValue={calculateMetricValue(data?.data, "Web", "Fritz International", "Contacto Peru", previousDateRange)}
              />
              <MetricCard
                title={<div className="flex items-center gap-2">🇨🇱 Contacto</div>}
                value={calculateMetricValue(data?.data, "Web", "Fritz International", "Contacto Chile", dateRange)}
                previousValue={calculateMetricValue(data?.data, "Web", "Fritz International", "Contacto Chile", previousDateRange)}
              />
              <MetricCard
                title={<div className="flex items-center gap-2">🇺🇸 Contacto</div>}
                value={calculateMetricValue(data?.data, "Web", "Fritz International", "Contacto Usa", dateRange)}
                previousValue={calculateMetricValue(data?.data, "Web", "Fritz International", "Contacto Usa", previousDateRange)}
              />
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Club 300 */}
      <section className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
        <SectionHeader
          icon={Users}
          title="Club 300"
          subtitle="club300fritz.com"
          color="bg-orange-500"
        />

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Home Club 300"
              value={calculateMetricValue(data?.data, "Web", "Club300", "Home Club300", dateRange)}
              previousValue={calculateMetricValue(data?.data, "Web", "Club300", "Home Club300", previousDateRange)}
            />
            <MetricCard
              title="Página Registro"
              value={calculateMetricValue(data?.data, "Web", "Club300", "Pagina Registro", dateRange)}
              previousValue={calculateMetricValue(data?.data, "Web", "Club300", "Pagina Registro", previousDateRange)}
            />
            <MetricCard
              title="Página Galería"
              value={calculateMetricValue(data?.data, "Web", "Club300", "Pagina Galeria", dateRange)}
              previousValue={calculateMetricValue(data?.data, "Web", "Club300", "Pagina Galeria", previousDateRange)}
            />
            <MetricCard
              title="Otras Páginas"
              value={calculateMetricValue(data?.data, "Web", "Club300", "Otras Paginas", dateRange)}
              previousValue={calculateMetricValue(data?.data, "Web", "Club300", "Otras Registro", previousDateRange)}
            />
          </div>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-700">Tendencia de Visitas Club 300</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={transformDataForChart(data?.data, "Club300", ["Home Club300", "Pagina Registro", "Pagina Galeria", "Otras Paginas"])}>
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
                  <Line type="monotone" dataKey="Home Club300" name="Home Club300" stroke="#1a73e8" strokeWidth={2} />
                  <Line type="monotone" dataKey="Pagina Registro" name="Pagina Registro" stroke="#34a853" strokeWidth={2} />
                  <Line type="monotone" dataKey="Pagina Galeria" name="Pagina Galeria" stroke="#fbbc04" strokeWidth={2} />
                  <Line type="monotone" dataKey="Otras Paginas" name="Otras Paginas" stroke="#ea4335" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
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

export default WebMetrics;