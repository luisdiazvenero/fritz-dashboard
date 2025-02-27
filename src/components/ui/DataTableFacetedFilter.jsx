import { Check, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DataTableFacetedFilter({ title, options, selected = [], setSelected }) {

    const safeOptions = Array.isArray(options) ? options : []; // Asegura que options sea un array
    


    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            {title}
            {selected.length > 0 && (
              <>
                <span className="ml-2 font-bold">{selected.length}</span>
              </>
            )}
            <Filter className="ml-2 h-4 w-4 opacity-50" />

          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-48 p-0">
          <Command>
          <CommandList>
            
            <CommandGroup>
              {safeOptions.map((option) => {
                const isSelected = selected.includes(option);
                return (
                  <CommandItem
                    key={option}
                    onSelect={() => {
                        
                        
                        setSelected((prev) => {
                            // Si `prev` es undefined, lo convertimos en un array vacío
                            if (!Array.isArray(prev)) {
                              console.error("❌ ERROR: `prev` es undefined o no es un array. Corrigiendo...");
                              prev = [];
                            }
                        
                            const newValue = isSelected
                              ? prev.filter((item) => item !== option)
                              : [...prev, option];
                        
                            console.log(`✅ Nuevo estado después de actualizar:`, newValue);
                            return newValue;
                          });
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
                    <span className="truncate w-full text-xs">{option}</span>

                  </CommandItem>
                );
              })}

{selected.length > 0 && (
   <>
     <CommandSeparator />
     <CommandGroup>
       <CommandItem
         onSelect={() => setSelected([])}
         className="justify-center text-center text-xs text-muted-foreground"
       >
         Limpiar filtro
       </CommandItem>
     </CommandGroup>
   </>
)}

            </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
  