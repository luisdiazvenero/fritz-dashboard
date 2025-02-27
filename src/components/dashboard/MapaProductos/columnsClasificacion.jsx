import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";

// Colores para el Tipo de producto
const typeColors = {
    "Operaciones": "bg-red-10 text-red-700",
    "Clientes/Venta": "bg-blue-10 text-blue-700",
  };
  
  // Colores para cada categoría
const categoryColors = {
    "Cereales, Granos y Carbohidratos": "bg-red-100 text-red-600",
    "Frutas, verduras y Tubérculos": "bg-yellow-100 text-yellow-600",
    "Proteínas": "bg-orange-100 text-orange-600",
    "Lácteos y derivados": "bg-green-100 text-green-600",
    "Embutidos": "bg-cyan-100 text-cyan-600",
    "Grasas y aceites": "bg-blue-100 text-blue-600",
    "Dulces y Snack": "bg-purple-100 text-purple-600",
    "Bebidas": "bg-pink-100 text-pink-600",
    "Salsas, aderezos y condimentos": "bg-red-100 text-red-500",
    "Desechables Food Service": "bg-gray-200 text-gray-500",
  };
  
  // Clasificaciones posibles
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
    ]
  };
  
  // **Definir las columnas**
  export const columnsClasificacion = [
    {
        accessorKey: "imagen",
        header: "Imagen",
        cell: ({ row }) => (
          <a href={row.original.imagen} target="_blank" rel="noopener noreferrer">
            <img 
              src={row.original.imagen || "/placeholder.svg"} 
              alt={row.original.producto} 
              className="w-[80px] h-[80px] object-cover rounded-md border"
            />
          </a>
        ),
        size: 100,
      },
    {
        accessorKey: "producto",
        //header: "Producto",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Producto" />,
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-gray-900 font-semibold">
            {row.original.producto}
          </span>
        ),
        size: 150,
      },
      {
        accessorKey: "categoria",
        //header: "Categoría",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Categoría" />,
        enableSorting: true,
        cell: ({ row }) => {
            const colorClass = categoryColors[row.original.categoria] || "bg-gray-100 text-gray-600";
            return (
              <span className={`font-bold px-2 py-1 rounded-md ${colorClass}`}>
                {row.original.categoria}
              </span>
            );
          },

        
        size: 280,
      },
      {
        accessorKey: "subcategoria",
        //header: "Sub Categoría",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Subcategoría" />,
    enableSorting: true,
        cell: ({ row }) => (
          <span className="text-gray-900 text-xs ">
            {row.original.subcategoria}
          </span>
        ),
        size: 150,
      },
      {
        accessorKey: "lineaoperacion",
        //header: "Linea de Operación",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Línea de Operación" />,
    enableSorting: true,
        cell: ({ row }) => (
          <span className="text-gray-700 text-xs font-medium">
            {row.original.lineaoperacion}
          </span>
        ),
        size: 150,
      },
    
      /* No va Tipo
      {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => {
        const tipo = row.original.tipo;
        const colorClass = typeColors[tipo] || "bg-gray-100 text-gray-600";
        return (
          <span className={`font-medium px-2 py-1 text-xs rounded-md ${colorClass}`}>
            {tipo}
          </span>
        );
      },
      size: 100,
    },
    */
    {
        accessorKey: "clasificacioncliente",
        //header: "Clasificación Cliente",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Clasificación Cliente" />,
    enableSorting: true,
        cell: ({ row }) => (
            <span className="text-gray-900 text-xs">
              {row.original.clasificacioncliente}
            </span>
          ),
          size: 150,
        },
        {
            accessorKey: "marca",
            //header: "Marca",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Marca" />,
    enableSorting: true,
            cell: ({ row }) => (
                <span className="text-gray-900 ">
                  {row.original.marca}
                </span>
              ),
              size: 100,
            },
    
    /* No va pais
    {
      accessorKey: "disponible",
      header: "Pais",
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original.disponible.map((pais, index) => (
            <span key={index} className="text-xl">{pais}</span>
          ))}
        </div>
      ),
      size: 100,
    },
    */
  ];
  