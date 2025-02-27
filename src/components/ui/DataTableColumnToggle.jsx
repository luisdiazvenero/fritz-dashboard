import { Check, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DataTableColumnToggle({ title = "Columnas", columns, visibleColumns, setVisibleColumns }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs flex gap-2">
          {title}
          <Settings2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-0">
        <Command>
          <CommandList>
            <CommandGroup>
            {columns.map((col) => {
  

  const isSelected = visibleColumns.includes(col.accessorKey);

  // Si `col.header` es una función (como un componente JSX), extrae el título si es posible
  const columnTitle =
    typeof col.header === "string"
      ? col.header
      : col.header?.({ column: {} })?.props?.title || "Sin título";

  return (
    <CommandItem
      key={col.accessorKey}
      onSelect={() => {
        setVisibleColumns((prev) =>
          isSelected
            ? prev.filter((key) => key !== col.accessorKey)
            : [...prev, col.accessorKey]
        );
      }}
    >
      <div
        className={cn(
          "mr-2 flex h-5 w-5 min-w-[20px] min-h-[20px] items-center justify-center rounded-sm border border-primary",
          isSelected ? "bg-primary text-primary-foreground" : "bg-white"
        )}
      >
        {isSelected && <Check className="h-4 w-4" />}
      </div>
      <span className="truncate w-full text-xs">{columnTitle}</span>
    </CommandItem>
  );
})}

            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
