import React, { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Filter, Settings, Settings2, Database } from 'lucide-react';

import { columns } from "./MapaProductos/columnsCatProd"; // Ruta actualizada
import { data } from "./MapaProductos/dataCatProd"; // Ruta actualizada
import { columnsClasificacion } from "./MapaProductos/columnsClasificacion";
import { dataClasificacion } from "./MapaProductos/dataClasificacion";

import { DataTableToolbar } from "@/components/ui/DataTableToolbar";
import { PopoverTest } from "@/components/ui/PopoverTest";


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
    const [selectedCategories, setSelectedCategories] = useState([]);
const [selectedLineasOperacion, setSelectedLineasOperacion] = useState([]);
const [selectedClasificacionCliente, setSelectedClasificacionCliente] = useState([]);


    const [visibleColumnsClasificacion, setVisibleColumnsClasificacion] = useState(columnsClasificacion.map(col => col.accessorKey));

    const [selectedTypes, setSelectedTypes] = useState([]);

   


    // Función para eliminar tildes (acentos) de una cadena
    const removeAccents = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Convertimos el término de búsqueda en minúsculas y sin tildes
    const searchTermNormalized = removeAccents(searchTerm.toLowerCase());

    // Filtrar datos por Categorías, Sub Categorías o Marcas
    const filteredData = data.filter((row) =>
        removeAccents(row.categoria.toLowerCase()).includes(searchTermNormalized) ||
        removeAccents(row.subcategorias.toLowerCase()).includes(searchTermNormalized) ||
        row.marcas.some(marca => removeAccents(marca.nombre.toLowerCase()).includes(searchTermNormalized))
    );

    const filteredDataClasificacion = dataClasificacion.filter((item) => {
        const searchClasificacionNormalized = removeAccents(searchClasificacion.toLowerCase());

        const matchesSearch =
            removeAccents(item.tipo?.toLowerCase() || "").includes(searchClasificacionNormalized) ||
            removeAccents(item.lineaoperacion?.toLowerCase() || "").includes(searchClasificacionNormalized) ||
            removeAccents(item.producto?.toLowerCase() || "").includes(searchClasificacionNormalized) ||
            removeAccents(item.categoria?.toLowerCase() || "").includes(searchClasificacionNormalized) ||
            removeAccents(item.subcategoria?.toLowerCase() || "").includes(searchClasificacionNormalized) ||
            removeAccents(item.clasificacionCliente?.toLowerCase() || "").includes(searchClasificacionNormalized) ||
            removeAccents(item.marca?.toLowerCase() || "").includes(searchClasificacionNormalized) ||
            (item.disponible?.some(
                (pais) =>
                    removeAccents(pais).includes(searchClasificacionNormalized) ||
                    Object.keys(countryFlags).some(
                        (key) => removeAccents(key).includes(searchClasificacionNormalized) && countryFlags[key] === pais
                    )
            ) || false);

        // Filtro por Categoría
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.categoria);

        // Filtro por Línea de Operación
        const matchesClassification =
            selectedLineasOperacion.length === 0 || selectedLineasOperacion.includes(item.lineaoperacion);

        // Filtro por Tipo
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.tipo);

        // Filtro por Clasificación Cliente
        const matchesClasificacionCliente =
            selectedClasificacionCliente.length === 0 || selectedClasificacionCliente.includes(item.clasificacioncliente);

        return matchesSearch && matchesCategory && matchesClassification && matchesType && matchesClasificacionCliente;
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
                            placeholder="Buscar.."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="md:text-xs text-xs w-72 h-10"
                        />

                        {/* Menú de selección de columnas */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="text-xs flex gap-2">
                                   Columnas <Settings2 className="w-4 h-4" />
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
                    <DataTable columns={columns.filter(col => visibleColumns.includes(col.accessorKey))} data={filteredData} enablePagination={false} />
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
                    
                    
                        {/* Filtros */}
                        <DataTableToolbar
                                searchValue={searchClasificacion}
                                onSearchChange={setSearchClasificacion}
                                selectedCategories={selectedCategories}
                                setSelectedCategories={setSelectedCategories}
                                selectedLineasOperacion={selectedLineasOperacion}
                                setSelectedLineasOperacion={setSelectedLineasOperacion}
                                selectedClasificacionCliente={selectedClasificacionCliente}
                                setSelectedClasificacionCliente={setSelectedClasificacionCliente}
                                visibleColumns={visibleColumnsClasificacion}
                                setVisibleColumns={setVisibleColumnsClasificacion}
                                columns={columnsClasificacion}k
                            />

                        
                   

                    {/* Tabla con columnas visibles */}
                    <DataTable columns={columnsClasificacion.filter(col => visibleColumnsClasificacion.includes(col.accessorKey))} data={filteredDataClasificacion} enablePagination={true} />
                </div>
            </section>
        </div>

    );
};

export default MapaProductos;
