import { X, Filter, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/components/ui/DataTableFacetedFilter";
import { DataTableColumnToggle } from "@/components/ui/DataTableColumnToggle";


import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  selectedCategories,
  setSelectedCategories,
  selectedLineasOperacion,
  setSelectedLineasOperacion,
  selectedClasificacionCliente,
  setSelectedClasificacionCliente,
  visibleColumns,
  setVisibleColumns,
  columns,
}) {

   

const isFiltered =
  selectedCategories.length > 0 ||
  selectedLineasOperacion.length > 0 ||
  selectedClasificacionCliente.length > 0;


  return (
    <div className="flex items-center justify-between gap-4 mt-4 mb-4">
      {/* Filtro de búsqueda */}
      <Input
        placeholder="Buscar.."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-72 h-8 text-xs"
      />

      <div className="flex items-center gap-2 flex-1">
        {/* Filtro de Categoría */}
       <DataTableFacetedFilter
  title="Categoría"
  options={[
    "Cereales, Granos y Carbohidratos", "Frutas, verduras y Tubérculos", "Proteínas",
    "Lácteos y derivados", "Embutidos", "Grasas y aceites", "Dulces y Snack",
    "Bebidas", "Salsas, aderezos y condimentos", "Desechables Food Service"
  ]}
  selected={selectedCategories}
  setSelected={setSelectedCategories}
/>


        {/* Filtro de Línea de Operación */}
        <DataTableFacetedFilter
        
  title="Línea de Operación"
  options={[
    "Línea de Emulsiones", "Línea de Cocción", "Línea de Salsas Líquidas",
    "Línea de Licuados", "Línea de Papas y Queso", "Línea de Bases Saborizadas", "Línea de Mermes"
  ]}
  selected={selectedLineasOperacion}
  setSelected={setSelectedLineasOperacion}
/>

        {/* Filtro de Clasificación Cliente */}
        <DataTableFacetedFilter
  title="Clasificación Cliente"
  options={["Consumo Masivo", "Food Service"]}

  selected={selectedClasificacionCliente}
  setSelected={setSelectedClasificacionCliente}
/>

{isFiltered && (
  <Button
    variant="ghost"
    onClick={() => {
      // Poner todos los estados de filtro en []
      setSelectedCategories([]);
      setSelectedLineasOperacion([]);
      setSelectedClasificacionCliente([]);
    }}
    className="h-8 px-3 text-xs"
    
  >
    Limpiar
    {/* Si deseas mostrar un ícono de 'X': */}
     <X className="ml-0 h-4 w-4 text-xs" /> 
  </Button>
)}

             

      </div>

      <DataTableColumnToggle
  columns={columns.filter((col) =>
    ["imagen", "categoria", "subcategoria", "lineaoperacion", "clasificacioncliente", "marca"].includes(col.accessorKey)
  )}
  visibleColumns={visibleColumns}
  setVisibleColumns={setVisibleColumns}
/>


      
    </div>
  );
}
