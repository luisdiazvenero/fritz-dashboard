import * as React from "react";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList,} from "@/components/ui/command";

export function PopoverTest() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Abrir Popover</Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-2">
        <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem>Opción 1</CommandItem>
            <CommandItem>Opción 2</CommandItem>
            <CommandItem>Opción 3</CommandItem>
          </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
