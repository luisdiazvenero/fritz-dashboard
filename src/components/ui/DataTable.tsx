import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  } from "@/components/ui/select"
  

export function DataTable({ columns, data, enablePagination = false  }) {
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),  // ✅ Activa la ordenación
        getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    });
    

  return (
    <div className="rounded-md border">
      <Table>
      <TableHeader className="bg-gray-100 border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

<TableBody>
  {table.getRowModel().rows.length > 0 ? (
    table.getRowModel().rows.map((row) => (
      <TableRow key={row.id} className="group">
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            className={`p-3 ${["id", "skus"].includes(cell.column.id) ? "text-center" : ""}`}
            style={{ width: cell.column.getSize() }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={columns.length} className="text-center p-4 text-gray-500">
        No hay datos disponibles
      </TableCell>
    </TableRow>
  )}
</TableBody>

      </Table>

      {enablePagination && (
  <div className="flex items-center justify-between border-t px-4 py-3 bg-white text-sm">

    {/* 📌 Izquierda: Cantidad de filas mostradas */}
    <div className="text-muted-foreground">
      Mostrando <strong>{table.getRowModel().rows.length}</strong> de <strong>{table.getFilteredRowModel().rows.length}</strong> filas
    </div>

    {/* 📌 Derecha: Selector de filas | Página actual | Botones */}
    <div className="flex items-center space-x-6 lg:space-x-8">
      
      {/* Selector de cantidad de filas */}
      <div className="flex items-center gap-2">
        <span>Mostrar</span>
        <Select
  value={`${table.getState().pagination.pageSize}`}
  onValueChange={(value) => {
    table.setPageSize(Number(value))
  }}
>
  <SelectTrigger className="h-8 w-[70px]">
    <SelectValue placeholder={table.getState().pagination.pageSize} />
  </SelectTrigger>
  <SelectContent side="top">
    {[10, 20, 30, 40, 50].map((pageSize) => (
      <SelectItem key={pageSize} value={`${pageSize}`}>
        {pageSize}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

      </div>

      {/* Página actual */}
      <span className="text-sm">
        Página <strong>{table.getState().pagination.pageIndex + 1}</strong> de {table.getPageCount()}
      </span>

      {/* Botones de paginación */}
      <div className="flex items-center gap-1">
        <button
          className="h-8 w-8 p-2  rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="w-4 h-4 stroke-[2]" />
        </button>
        <button
          className="h-8 w-8 p-2  rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="w-4 h-4 stroke-[2]" />
        </button>
        <button
          className="h-8 w-8 p-2  rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="w-4 h-4 stroke-[2]" />
        </button>
        <button
        
          className="h-8 w-8 p-2 items-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

    </div>
  </div>
)}




    </div>
  );
}