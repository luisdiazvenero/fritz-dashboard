import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MetricsManagement = () => {
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMetric, setSelectedMetric] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [metrics, setMetrics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    metric: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const metricOptions = {
    Web: {
      "Fritz International": [
        "Total Visitas",
        "Home Venezuela",
        "Home Chile",
        "Home Perú",
        "Home USA",
        "Contacto Venezuela",
        "Contacto Chile",
        "Contacto Perú",
        "Contacto USA",
        "Pagina Sorpresas",
        "Click en Jugar",
        "Nuevos Fritz Lover",
      ],
      "Club 300": [
        "Total Visitas",
        "Home Club 300",
        "Pagina Registro",
        "Pagina Galeria",
        "Otras",
      ],
    },
    "Redes Sociales": {
      YouTube: [
        "Suscriptores",
        "Nuevos Suscriptores",
        "Videos",
        "Nuevos Videos",
        "Visualizaciones",
      ],
      Instagram: [
        "Total Seguidores",
        "Nuevos Followers",
        "Impresiones",
        "Alcance",
        "Interacciones",
      ],
      TikTok: [
        "Seguidores",
        "Nuevos Seguidores",
        "Seguidores Netos",
        "Visualizaciones Videos",
        "Visualizaciones Perfil",
        "Me gusta",
        "Compartidos",
      ],
      Facebook: ["Total Seguidores", "Nuevos Followers"],
    },
    "Inversion en Medios": {
      "Gastos por Plataforma": ["Gasto en Google ADS", "Gasto en META Ads"],
      "Métricas de Performance": ["CTR", "CPC"],
      "Métricas META": [
        "Alcance en META",
        "Seguimiento Facebook",
        "Seguidores Instagram",
      ],
      "Métricas de Interacción": [
        "Interacciones",
        "Comentarios",
        "Compartidos",
        "Reproducciones",
        "Clicks",
      ],
      Conversiones: ["Registros Club 300"],
    },
  };

  const handleAddMetric = () => {
    const newMetric = {
      type: selectedType,
      category: selectedCategory,
      metric: selectedMetric,
      value,
      date,
    };

    if (isEditing && editIndex !== null) {
      setMetrics((prevMetrics) =>
        prevMetrics.map((metric, index) =>
          index === editIndex ? newMetric : metric
        )
      );
    } else {
      setMetrics((prevMetrics) => [...prevMetrics, newMetric]);
    }

    resetForm();
    setIsModalOpen(false);
  };

  const handleEditMetric = (index) => {
    const metricToEdit = metrics[index];
    setSelectedType(metricToEdit.type);
    setSelectedCategory(metricToEdit.category);
    setSelectedMetric(metricToEdit.metric);
    setValue(metricToEdit.value);
    setDate(metricToEdit.date);
    setEditIndex(index);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedType("");
    setSelectedCategory("");
    setSelectedMetric("");
    setValue("");
    setDate("");
    setEditIndex(null);
    setIsEditing(false);
  };

  const handleDeleteMetric = (index) => {
    setMetrics((prevMetrics) => prevMetrics.filter((_, i) => i !== index));
  };

  const filteredMetrics = metrics
    .filter((metric) =>
      filters.type && filters.type !== "Todos"
        ? metric.type === filters.type
        : true
    )
    .filter((metric) =>
      filters.category && filters.category !== "Todas"
        ? metric.category === filters.category
        : true
    )
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(metrics.length / itemsPerPage);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Métricas</h1>
        <Dialog
          open={isModalOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) resetForm();
            setIsModalOpen(isOpen);
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsEditing(false);
                setIsModalOpen(true);
              }}
            >
              Agregar Métrica
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar Métrica" : "Agregar Métrica"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Tipo</label>
                <Select
                  value={selectedType}
                  onValueChange={(value) => {
                    setSelectedType(value);
                    setSelectedCategory("");
                    setSelectedMetric("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web">Web</SelectItem>
                    <SelectItem value="Redes Sociales">Redes Sociales</SelectItem>
                    <SelectItem value="Inversion en Medios">
                      Inversión en Medios
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedType && (
                <div>
                  <label className="block text-sm font-medium">Categoría</label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => {
                      setSelectedCategory(value);
                      setSelectedMetric("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(metricOptions[selectedType] || {}).map(
                        (category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedCategory && (
                <div>
                  <label className="block text-sm font-medium">Métrica</label>
                  <Select
                    value={selectedMetric}
                    onValueChange={(value) => setSelectedMetric(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una métrica" />
                    </SelectTrigger>
                    <SelectContent>
                      {(metricOptions[selectedType]?.[selectedCategory] || []).map(
                        (metric) => (
                          <SelectItem key={metric} value={metric}>
                            {metric}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedMetric && (
                <>
                  <div>
                    <label className="block text-sm font-medium">Valor</label>
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Ingrese el valor"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Fecha</label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
            <Button onClick={handleAddMetric}>
              {isEditing ? "Guardar Cambios" : "Agregar"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters({ ...filters, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Web">Web</SelectItem>
                  <SelectItem value="Redes Sociales">Redes Sociales</SelectItem>
                  <SelectItem value="Inversion en Medios">
                    Inversión en Medios
                  </SelectItem>
                </SelectContent>
              </Select>
            </TableHead>
            <TableHead>
              <Select
                value={filters.category}
                onValueChange={(value) =>
                  setFilters({ ...filters, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas</SelectItem>
                  {Object.keys(metricOptions[filters.type] || {}).map(
                    (category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </TableHead>
            <TableHead>Métrica</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMetrics.map((metric, index) => (
            <TableRow key={index}>
              <TableCell>
                <span
                  className={cn(
                    "px-2 py-1 text-xs font-semibold rounded-full",
                    metric.type === "Web" && "bg-green-100 text-green-700",
                    metric.type === "Redes Sociales" && "bg-blue-100 text-blue-700",
                    metric.type === "Inversion en Medios" &&
                      "bg-yellow-100 text-yellow-700"
                  )}
                >
                  {metric.type}
                </span>
              </TableCell>
              <TableCell
                className={cn(
                  metric.category === "YouTube" && "text-red-500",
                  metric.category === "Instagram" && "text-purple-500",
                  metric.category === "TikTok" && "text-black",
                  metric.category === "Facebook" && "text-blue-600"
                )}
              >
                {metric.category}
              </TableCell>
              <TableCell>{metric.metric}</TableCell>
              <TableCell>{metric.value}</TableCell>
              <TableCell>{metric.date}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="secondary"
                  size="sm"
                  className="mr-2"
                  onClick={() => handleEditMetric(index)}
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteMetric(index)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <div className="flex items-center space-x-4">
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(parseInt(value, 10))}
          >
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Seleccione cantidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};

export default MetricsManagement;
