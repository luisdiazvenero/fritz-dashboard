import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const serviceAreas = ["DiFritz", "Cono Sur", "Marketing Fritz", "Norte América", "ATH", "Comercial Fritz"];
const fixedData = [
  { area: "DiFritz", average: 4.2 },
  { area: "Cono Sur", average: 3.8 },
  { area: "Marketing Fritz", average: 4.5 },
  { area: "Norte América", average: 3.6 },
  { area: "ATH", average: 4.0 },
  { area: "Comercial Fritz", average: 4.1 },
];

const questions = [
  { text: "¿Comprendieron bien la visión y objetivos de los proyectos?", average: 4.2 },
  { text: "¿Se cumplieron los tiempos de entrega esperados?", average: 3.8 },
  { text: "¿El equipo respondió con rapidez y eficiencia?", average: 4.5 },
];

const ServiceLevel = () => {
  const [selectedArea, setSelectedArea] = useState("Todos");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Nivel de Servicio Global</h1>
      <div className="grid grid-cols-3 gap-4">
        {fixedData.map(({ area, average }) => (
          <Card key={area}>
            <CardHeader>
              <CardTitle>{area}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-lg font-bold">{average.toFixed(1)}</CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico de Barras con estilo ShadCN */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Comparación de Áreas</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={fixedData}>
            <XAxis dataKey="area" className="text-xs" />
            <YAxis domain={[1, 5]} />
            <Tooltip cursor={{ fill: "#f0f0f0" }} />
            <Bar dataKey="average" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Filtro por Área */}
      <Select onValueChange={setSelectedArea} defaultValue="Todos">
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar área" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todos">Todos</SelectItem>
          {serviceAreas.map((area) => (
            <SelectItem key={area} value={area}>{area}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Tabla de Preguntas */}
      <table className="w-full border-collapse border border-gray-200 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Pregunta</th>
            <th className="p-2 text-center">Promedio</th>
          </tr>
        </thead>
        <tbody>
          {questions.map(({ text, average }, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{text}</td>
              <td className="p-2 text-center font-bold">
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div className={`h-4 ${average >= 4 ? 'bg-green-500' : average >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${(average / 5) * 100}%` }}></div>
                  </div>
                  <span>{average.toFixed(1)}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceLevel;
