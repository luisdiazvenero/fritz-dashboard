import EmojiBox from "@/components/ui/EmojiBox";

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

// Colores para los números en la columna `#`
const numberColors = {
  1: "bg-red-600 text-white",
  2: "bg-yellow-600 text-white",
  3: "bg-orange-600 text-white",
  4: "bg-green-600 text-white",
  5: "bg-cyan-600 text-white",
  6: "bg-blue-600 text-white",
  7: "bg-purple-600 text-white",
  8: "bg-pink-500 text-white",
  9: "bg-red-500 text-white",
  10: "bg-gray-500 text-white",
};

// Definir las columnas
export const columns = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => {
      const colorClass = numberColors[row.original.id] || "bg-gray-600 text-white";
      return (
        <span className={`text-sm font-black px-2 py-1 rounded-lg ${colorClass} text-center block w-full`}>
          {row.original.id}
        </span>
      );
    },
    size: 48,
  }
  ,
  {
    accessorKey: "iconos",
    header: "",
    cell: ({ row }) => <EmojiBox emojis={row.original.iconos} />,
    size: 80,
  },
  {
    accessorKey: "categoria",
    header: "Categorías",
    cell: ({ row }) => {
      const colorClass = categoryColors[row.original.categoria] || "bg-gray-100 text-gray-600";
      return (
        <span className={`font-bold px-2 py-1 rounded-md ${colorClass}`}>
          {row.original.categoria}
        </span>
      );
    },
    size: 300,
  },
  {
    accessorKey: "subcategorias",
    header: "Sub Categorías",
    cell: ({ row }) => (
      <span className="text-gray-500 text-xs block">{row.original.subcategorias}</span>
    ),
    size: 300,
  },
  {
    accessorKey: "skus",
    header: "SKUs",
    cell: ({ row }) => <span className="font-bold text-gray-700">{row.original.skus}</span>,
    size: 50,
  },
  {
    accessorKey: "marcas",
    header: "Marcas Top",
    cell: ({ row }) => (
      <div className="flex gap-4 overflow-x-auto flex-nowrap group">
        {row.original.marcas.map((marca, index) => (
          <img
            key={index}
            src={marca.logo}
            alt={marca.nombre}
            title={marca.nombre}
            className={`max-w-[100px] object-contain transition-all duration-300 ${
              marca.logo.includes("fritz.png") ? "" : "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"
            }`}
          />
        ))}
      </div>
    ),
    size: 400,
  },
  
];
