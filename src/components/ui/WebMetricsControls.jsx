import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Pause, Play } from 'lucide-react';

const WebMetricsControls = ({ onRefresh, onToggleAutoRefresh, isAutoRefreshEnabled }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onRefresh(true)}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Actualizar ahora
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
};

export default WebMetricsControls;