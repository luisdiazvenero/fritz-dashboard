import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import FileDropzone from '@/components/ui/FileDropzone';
import { api } from '@/lib/api';

const DataImport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const processExcelData = async (excelData) => {
    // Aquí procesamos los datos del Excel para cada tipo
    const { web, social, media } = excelData;
    const results = [];

    if (web && web.length > 0) {
      try {
        const response = await api.import.uploadData({ type: 'web', data: web });
        results.push({ type: 'web', count: response.count });
      } catch (error) {
        throw new Error(`Error importando datos web: ${error.message}`);
      }
    }

    if (social && social.length > 0) {
      try {
        const response = await api.import.uploadData({ type: 'social', data: social });
        results.push({ type: 'social', count: response.count });
      } catch (error) {
        throw new Error(`Error importando datos sociales: ${error.message}`);
      }
    }

    if (media && media.length > 0) {
      try {
        const response = await api.import.uploadData({ type: 'media', data: media });
        results.push({ type: 'media', count: response.count });
      } catch (error) {
        throw new Error(`Error importando datos de media: ${error.message}`);
      }
    }

    return results;
  };

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Aquí iría la lógica de procesar el Excel con exceljs
      // Por ahora simulamos los datos procesados
      const processedData = {
        web: [
          {
            date: "2024-01-01",
            site: "fritzinternational.us",
            page: "homepage",
            visits: 1500,
            newLovers: 120
          }
        ]
      };

      const results = await processExcelData(processedData);
      setSuccess(`Datos importados exitosamente: ${results.map(r => `${r.count} registros de ${r.type}`).join(', ')}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Importar Datos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-2">Formato Esperado:</h3>
            <p className="text-sm text-gray-600">El archivo Excel debe contener las siguientes hojas:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
              <li>web: date, site, page, visits, newLovers</li>
              <li>social: date, platform, followers, views, interactions</li>
              <li>media: date, platform, spend, reach, ctr, cpc</li>
            </ul>
          </div>

          <FileDropzone 
            onFileAccepted={handleFileUpload}
            loading={loading}
          />

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertTitle>Éxito</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataImport;