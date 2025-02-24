import React, { useState } from "react";
import { Img } from "react-image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, Settings, Database } from 'lucide-react';
import EmojiBox from "@/components/ui/EmojiBox";

import { columns } from "./MapaProductos/columnsCatProd"; // Ruta actualizada
import { data } from "./MapaProductos/dataCatProd"; // Ruta actualizada
import { columnsClasificacion } from "./MapaProductos/columnsClasificacion";
import { dataClasificacion } from "./MapaProductos/dataClasificacion";

import { DataTable } from "@/components/ui/DataTable"; // Tabla reutilizable

import { Input } from "@/components/ui/input"; // Campo de búsqueda
import { Button } from "@/components/ui/button"; // Botón de mostrar/ocultar columnas

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuItem
  } from "@/components/ui/dropdown-menu";

const countryFlags = {
    "venezuela": "🇻🇪",
    "peru": "🇵🇪",
    "chile": "🇨🇱",
    "usa": "🇺🇸",
    "españa": "🇪🇸",
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

const MapaProductos = () => {
    const imagenURL = "https://shipixen.com/placeholder.svg"; // URL de la imagen (puedes cambiarla)

    const [searchTerm, setSearchTerm] = useState("");
    const [visibleColumns, setVisibleColumns] = useState(
        columns.map((col) => col.accessorKey) // Todas las columnas visibles por defecto
    );

    const [searchClasificacion, setSearchClasificacion] = useState("");
const [visibleColumnsClasificacion, setVisibleColumnsClasificacion] = useState(columnsClasificacion.map(col => col.accessorKey));
const [selectedClassifications, setSelectedClassifications] = useState([]);
const [selectedTypes, setSelectedTypes] = useState([]);

    // Filtrar datos por Categorías, Sub Categorías o Marcas
    const filteredData = data.filter((row) =>
        row.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.subcategorias.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.marcas.some(marca => marca.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredDataClasificacion = dataClasificacion.filter((item) => {
       // Filtro de búsqueda (coincidencia en cualquier campo relevante)
    const matchesSearch =
    item.tipo.toLowerCase().includes(searchClasificacion.toLowerCase()) ||
    item.clasificacion.toLowerCase().includes(searchClasificacion.toLowerCase()) ||
    item.producto.toLowerCase().includes(searchClasificacion.toLowerCase()) ||
    item.disponible.some(
        (pais) =>
            pais.includes(searchClasificacion) ||
            Object.keys(countryFlags).some(
                (key) => key.includes(searchClasificacion.toLowerCase()) && countryFlags[key] === pais
            )
    ); // Busca por emoji o por nombre del país

// Filtro por Clasificación
const matchesClassification =
    selectedClassifications.length === 0 || selectedClassifications.includes(item.clasificacion);

// Filtro por Tipo
const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.tipo);

return matchesSearch && matchesClassification && matchesType;
    });
    

      
      // Definir las clasificaciones de productos
const classifications = {
    "Operaciones": [
      "Línea de Emulsiones",
      "Línea de Cocción",
      "Línea de Salsas Líquidas",
      "Línea de Licuados",
      "Línea de Papas y Queso",
      "Línea de Bases Saborizadas",
      "Línea de Mermes",
    ],
    "Clientes/Venta": [
      "Consumo Masivo",
      "Food Service",
    ],
  };
  

    return (
        <div className="space-y-12">
            <section className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                <SectionHeader
                    icon={Database}
                    title="Categorías"
                    subtitle="Desarrollo de Nuevos Productos"
                    color="bg-blue-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {/* Contenedor flex para alinear los elementos */}
                    <div className="flex items-center justify-between mt-4 mb-4">
                        {/* Filtro a la izquierda */}
                        <Input
                            placeholder="Filtrar: Categorías, Sub Categorías, Marcas.."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="md:text-xs text-xs w-72 h-10"
                        />

                        {/* Menú de selección de columnas */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="text-xs flex gap-2">
                                    <Settings className="w-4 h-4" /> Ocultar
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Mostrar</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {columns
                                    .filter((col) => col.accessorKey !== "iconos") // ❌ Evita que "iconos" esté en la lista
                                    .map((col) => (
                                        <DropdownMenuCheckboxItem
                                            key={col.accessorKey}
                                            checked={visibleColumns.includes(col.accessorKey)}
                                            onCheckedChange={(checked) => {
                                                setVisibleColumns((prev) =>
                                                    checked
                                                        ? [...prev, col.accessorKey]
                                                        : prev.filter((key) => key !== col.accessorKey)
                                                );
                                            }}
                                        >
                                            {col.header}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Tabla con columnas visibles */}
                    <DataTable columns={columns.filter(col => visibleColumns.includes(col.accessorKey))} data={filteredData} enablePagination={false}  />
                </div>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                <SectionHeader
                    icon={Settings}
                    title="Clasificación"
                    subtitle="Desarrollo de Nuevos Productos"
                    color="bg-red-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {/* Contenedor flex para alinear los elementos */}
                    <div className="flex items-center justify-between mt-4 mb-4">
                    <div className="flex items-center gap-2">
                        {/* Filtro a la izquierda */}
                        <Input
                            placeholder="Filtrar: Tipo, Clasificación, Producto, País"
                            value={searchClasificacion}
                            onChange={(e) => setSearchClasificacion(e.target.value)}
                            className="md:text-xs text-xs w-72 h-10"
                        />
                        {/* Botón de filtro para Clasificación */}
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="text-xs flex gap-2">
      <Filter className="w-4 h-4" /> Clasificación
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start" className="w-48">
    <DropdownMenuLabel>Clasificación</DropdownMenuLabel>
    <DropdownMenuSeparator />
    {Object.values(classifications).flat().map((clasificacion, index) => (
      <DropdownMenuCheckboxItem
        key={index}
        checked={selectedClassifications.includes(clasificacion)}
        onCheckedChange={(checked) => {
          setSelectedClassifications((prev) =>
            checked
              ? [...prev, clasificacion]
              : prev.filter((item) => item !== clasificacion)
          );
        }}
      >
        {clasificacion}
      </DropdownMenuCheckboxItem>
    ))}
    <DropdownMenuSeparator />
    <DropdownMenuItem
      className="text-center text-red-500 cursor-pointer"
      onClick={() => setSelectedClassifications([])}
    >
      Limpiar filtros
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>


                       {/* Botón de filtro para Tipo */}
                       <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="text-xs flex gap-2">
      <Filter className="w-4 h-4" /> Tipo
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start" className="w-48">
    <DropdownMenuLabel>Tipo</DropdownMenuLabel>
    <DropdownMenuSeparator />

    {Object.keys(classifications).map((tipo, index) => (
      <DropdownMenuCheckboxItem
        key={index}
        checked={selectedTypes.includes(tipo)}
        onCheckedChange={(checked) => {
          setSelectedTypes((prev) =>
            checked ? [...prev, tipo] : prev.filter((item) => item !== tipo)
          );
        }}
      >
        {tipo}
      </DropdownMenuCheckboxItem>
    ))}

    <DropdownMenuSeparator />
    <DropdownMenuItem
      className="text-red-500 cursor-pointer"
      onSelect={() => setSelectedTypes([])} // Limpia la selección
    >
      Limpiar filtros
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>


                        </div>

                        {/* Menú de selección de columnas */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="text-xs flex gap-2">
                                    <Settings className="w-4 h-4" /> Ocultar
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Mostrar</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {columnsClasificacion.map((col) => (
                                    <DropdownMenuCheckboxItem
                                        key={col.accessorKey}
                                        checked={visibleColumnsClasificacion.includes(col.accessorKey)}
                                        onCheckedChange={(checked) => {
                                            setVisibleColumnsClasificacion((prev) =>
                                                checked
                                                    ? [...prev, col.accessorKey]
                                                    : prev.filter((key) => key !== col.accessorKey)
                                            );
                                        }}
                                    >
                                        {col.header}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Tabla con columnas visibles */}
                    <DataTable columns={columnsClasificacion.filter(col => visibleColumnsClasificacion.includes(col.accessorKey))} data={filteredDataClasificacion} enablePagination={true}/>
                </div>
            </section>
        </div>

    );
};

export default MapaProductos;
