import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { BarChart3, Globe2, Users } from 'lucide-react';
import MetricCard from '../ui/MetricCard';
import {
    Table,
    TableBody,
    
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

const serviceAreas = ["DiFritz", "Cono Sur", "Marketing Fritz", "Norte América", "ATH", "Comercial Fritz"];
const fixedData = [
    { area: "DiFritz", average: 4.15, icon: "📦" },
    { area: "Cono Sur", average: 4.12, icon: "🌎" },
    { area: "Marketing", average: 3.65, icon: "❇️" },
    { area: "Norte América", average: 4.85, icon: "🇺🇸" },
    { area: "ATH", average: 4.9, icon: "💼" },
    { area: "Comercial", average: 3.83, icon: "📊" },
];

const sections = [
    { title: "01. Servicio de la Agencia", questions: 10, color: "gray-300", promedio: 3.96 },
    { title: "02. Diseño de Empaques", questions: 3, color: "blue-200", promedio: 4.06 },
    { title: "03. Calendario en Redes Sociales", questions: 6, color: "gray-300", promedio: 4.00 },
    { title: "04. Producción de Videos", questions: 5, color: "blue-200", promedio: 4.46 },
    { title: "05. Desarrollo Paginas Web", questions: 5, color: "gray-300", promedio: 4.11 },
    { title: "06. Lanzamiento de Productos Nuevos", questions: 4, color: "blue-200", promedio: 3.83 },
    { title: "07. Resultados y Reportes", questions: 7, color: "gray-300", promedio: 3.35 },
];

const questions = {
    "01. Servicio de la Agencia": [
        { text: "¿El equipo comprendió la visión y objetivos de cada proyecto?", average: 4.0 },
        { text: "¿Mostraron interés en entender las necesidades específicas de cada proyecto?", average: 4.19 },
        { text: "¿Los diseños y producción de las piezas publicitarias reflejaron un alto nivel profesional?", average: 3.63 },
        { text: "¿Los trabajos de la agencia representan fielmente la identidad y valores de la marca FRITZ?", average: 4.5 },
        { text: "¿El equipo mostró flexibilidad ante ajustes o urgencias de cada proyecto?", average: 3.88 },
        { text: "¿El equipo estuvo disponible para resolver dudas durante el proceso?", average: 4.06 },
        { text: "¿Se propusieron ideas innovadoras para mejorar rendimiento y optimización ?", average: 3.66 },
        { text: "¿Se resolvieron problemas técnicos o errores de manera rápida?", average: 3.88 },
        { text: "¿Se ajustaron estrategias en base a los resultados obtenidos?", average: 3.94 },
        { text: "¿Crees que el trabajo de la agencia contribuyó a mejorar la interacción y el alcance de Fritz en el mercado?", average: 3.94 },
    ],
    "02. Diseño de Empaques": [
        { text: "¿Los diseños de los empaques son atractivos y alineados con la identidad de FRITZ?", average: 4.31 },
        { text: "¿Los empaques logran diferenciarse en el mercado y atraer al público objetivo?", average: 4.13 },
        { text: "¿Las modificaciones en los diseños se implementaron con rapidez y precisión?", average: 3.75 },
    ],
    "03. Calendario en Redes Sociales": [
        { text: "¿Los contenidos publicados fueron relevantes y atractivos para la audiencia?", average: 3.94 },
        { text: "¿Las imágenes, videos y diseños reflejaron profesionalismo y creatividad?", average: 3.94 },
        { text: "¿Las publicaciones fueron consistentes con la identidad y valores de FRITZ?", average: 4.38 },
        { text: "¿Se respetó el calendario de publicaciones acordado?", average: 4.0 },
        { text: "¿Se adaptaron rápidamente los contenidos a eventos o tendencias inesperadas?", average: 3.75 },
        { text: "¿Las consultas y comentarios en redes sociales se atendieron de manera rápida y efectiva?", average: 4.0 },
    ],
    "04. Producción de Videos": [
        { text: "¿Los videos reflejan profesionalismo en la edición, grabación y efectos?", average: 4.50 },
        { text: "¿Los mensajes de los videos fueron fáciles de entender y atractivos?", average:4.50 },
        { text: "¿Los videos se adaptan bien a las necesidades y objetivos del proyecto?", average: 4.38 },
        { text: "¿El tono y estilo de los videos fueron adecuados para la marca?", average: 4.50 },
        { text: "¿Crees que los videos generan el impacto deseado en la audiencia?", average: 4.44 },
    ],
    "05. Desarrollo Paginas Web": [
        { text: "¿Los diseños de las páginas web son atractivos y alineados con la identidad de la marca?", average:4.13 },
        { text: "¿La navegación y usabilidad de las web fueron intuitivas y accesibles?", average: 4.0 },
        { text: "¿Los sitios web, cargan rápido y funcionan sin errores?", average: 4.13 },
        { text: "¿Los contenidos se presentaron de forma clara y estructurada?", average: 4.07 },
        { text: "¿Los diseños se adaptaron correctamente a dispositivos móviles y desktop?", average: 4.2 },
    ],
    "06. Lanzamiento de Productos Nuevos": [
        { text: "¿Las estrategias de lanzamiento estuvieron bien definidas y alineadas con los objetivos del producto?", average: 3.69 },
        { text: "¿Los materiales de comunicación (anuncios, imágenes, contenido) fueron creativos e innovadores? ", average: 3.94 },
        { text: "¿Los mensajes del lanzamiento fueron claros y persuasivos para el público objetivo?", average: 4.0 },
        { text: "¿Los planes de lanzamientos se ejecutaron dentro de los plazos acordados?", average: 3.69 },
    ],
    "07. Resultados y Reportes": [
        { text: "¿Los reportes presentaron datos relevantes y bien estructurados?", average: 3.31 },
        { text: "¿Las métricas y KPIs fueron explicadas de manera clara?", average: 3.13 },
        { text: "¿Los informes permitieron tomar decisiones estratégicas?", average: 3.38 },
        { text: "¿La presentación visual de los reportes facilitó su comprensión?", average: 3.38 },
        { text: "¿Los datos fueron interpretados con precisión y sin errores?", average: 3.38 },
        { text: "¿Se realizaron ajustes en las estrategias basadas en los reportes?", average: 3.38 },
        { text: "¿Las recomendaciones fueron prácticas y aplicables?", average: 3.5 },
    ],
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

const ServiceLevel = () => {
    const [selectedArea, setSelectedArea] = useState("Todos");

    return (
        <div className="space-y-12">
            <section className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                <SectionHeader
                    icon={BarChart3}
                    title="Nivel de Servicio"
                    subtitle="Resumen por Área de Servicio"
                    color="bg-blue-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-0 mt-6">

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">


                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{<Globe2 className="h-6 w-6 text-blue-500" />}</span>
                                    <CardTitle className="text-sm font-medium">Promedio Global de Servicio</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black">
                                3.97
                                </div>

                                <div className={`text-xs  text-green-600  flex items-center gap-1 mt-1`}>
                                    <span> ↑ </span>
                                    <span>Infinity%</span>
                                    <span className="text-muted-foreground ml-1">vs anterior</span>
                                </div>

                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={fixedData}>
                                        <XAxis dataKey="area" className="text-xs" />

                                        <Tooltip cursor={{ fill: "#f0f0f0" }} />
                                        <Bar dataKey="average" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>

                            </CardContent>


                        </Card>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">

                        {fixedData.map(({ area, average, icon }) => (
                            <MetricCard key={area} title={area}
                                value={average.toFixed(1)}
                                previousValue={0} // Este puede calcularse si tienes datos históricos similares
                                icon={icon} />

                        ))}</div>
                </div>



            </section>

            {/* Secciones con Preguntas */}
            <div className="grid grid-cols-1 gap-6">
                {sections.map((section) => (
                    <div key={section.title} className={`border-l-4 border-${section.color} rounded-lg`} >
                    <Card key={section.title}>
                        <CardHeader>
                            <CardTitle className="font-bold text-xl">{section.title} </CardTitle>
                        </CardHeader>
                        <CardContent>
                            
                            <Table className="table-auto">
                           
                            <TableHeader className="bg-gray-50 border"
                            >
                                <TableRow>
                                
                                <TableHead className="text-blue-600 font-semibold">Preguntas</TableHead>
                                <TableHead className="w-[100px] text-right  font-semibold">Promedio: <span className="text-xl text-black">{section.promedio}</span> </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="border">

                            {(questions[section.title] || []).map(({ text, average }, index) => (
                                <TableRow>
                                <TableCell className="font-normal">{text}</TableCell>
                                <TableCell className="text-right font-semibold">
                                <div className="flex items-center space-x-2">
                                                    <div className="w-32 bg-gray-200 rounded-full h-4 overflow-hidden">
                                                        <div className={`h-4 ${average >= 4 ? 'bg-green-500' : average >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${(average / 5) * 100}%` }}></div>
                                                    </div>
                                                    <span>{average.toFixed(1)}</span>
                                                </div>
                                </TableCell>
                                </TableRow>
 ))}
                                
                            </TableBody>
                            </Table>


                           
                        </CardContent>
                    </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceLevel;