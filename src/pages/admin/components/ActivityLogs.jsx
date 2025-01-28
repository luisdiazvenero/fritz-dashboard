import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Upload, BarChart3, AlertCircle } from 'lucide-react';

const ActivityLogs = () => {
  const logs = [
    { 
      id: 1, 
      type: 'user', 
      action: 'Nuevo usuario creado', 
      details: 'editor@mil.com',
      timestamp: '2024-01-10 15:30:00',
      user: 'admin@mil.com'
    },
    { 
      id: 2, 
      type: 'import', 
      action: 'Importación de datos', 
      details: 'metrics_2024_01.xlsx',
      timestamp: '2024-01-10 14:20:00',
      user: 'editor@mil.com'
    },
    { 
      id: 3, 
      type: 'metric', 
      action: 'Métrica actualizada', 
      details: 'Visitas Totales',
      timestamp: '2024-01-10 12:15:00',
      user: 'editor@mil.com'
    },
    { 
      id: 4, 
      type: 'alert', 
      action: 'Error de sistema', 
      details: 'Error en la importación de datos',
      timestamp: '2024-01-09 16:45:00',
      user: 'sistema'
    },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'user': return <User className="h-4 w-4" />;
      case 'import': return <Upload className="h-4 w-4" />;
      case 'metric': return <BarChart3 className="h-4 w-4" />;
      case 'alert': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs de Actividad</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
              <div className="mt-1">
                {getIcon(log.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{log.action}</h3>
                  <span className="text-sm text-gray-500">{log.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                <p className="text-sm text-gray-500 mt-1">Por: {log.user}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLogs;