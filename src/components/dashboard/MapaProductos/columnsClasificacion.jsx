// Colores para el Tipo de producto
const typeColors = {
    "Operaciones": "bg-red-100 text-red-600",
    "Clientes/Venta": "bg-blue-100 text-blue-600",
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
        size: 0,
      },
    {
        accessorKey: "producto",
        header: "Producto",
        cell: ({ row }) => (
          <span className="text-gray-900 font-semibold">
            {row.original.producto}
          </span>
        ),
        size: 150,
      },
      {
        accessorKey: "clasificacion",
        header: "Clasificación",
        cell: ({ row }) => (
          <span className="text-gray-700 font-medium">
            {row.original.clasificacion}
          </span>
        ),
        size: 150,
      },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => {
        const tipo = row.original.tipo;
        const colorClass = typeColors[tipo] || "bg-gray-100 text-gray-600";
        return (
          <span className={`font-bold px-2 py-1 rounded-md ${colorClass}`}>
            {tipo}
          </span>
        );
      },
      size: 100,
    },
    
    
    {
      accessorKey: "disponible",
      header: "Disponible en",
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original.disponible.map((pais, index) => (
            <span key={index} className="text-xl">{pais}</span>
          ))}
        </div>
      ),
      size: 250,
    },
  ];
  