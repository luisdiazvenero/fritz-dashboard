import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

export default function ColumnVisibilityToggle({ columns, setVisibleColumns }) {
  const [selectedColumns, setSelectedColumns] = useState(columns.map((col) => col.accessorKey));

  const toggleColumn = (accessorKey) => {
    let updatedColumns = selectedColumns.includes(accessorKey)
      ? selectedColumns.filter((col) => col !== accessorKey)
      : [...selectedColumns, accessorKey];

    setSelectedColumns(updatedColumns);
    setVisibleColumns(columns.filter((col) => updatedColumns.includes(col.accessorKey)));
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Mostrar/Ocultar Columnas
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="bg-white shadow-md rounded-md p-2">
        {columns.map((col) => (
          <DropdownMenu.Item key={col.accessorKey} className="flex items-center gap-2 px-2 py-1 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedColumns.includes(col.accessorKey)}
              onChange={() => toggleColumn(col.accessorKey)}
            />
            {col.header}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
