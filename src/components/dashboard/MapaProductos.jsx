import React, { useState } from "react";
import { Img } from "react-image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";  
import { Database, ImageOff } from 'lucide-react';

const SectionHeader = ({ icon: Icon, title, subtitle, color }) => (
    <div className="mb-6">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
                <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            </div>
        </div>
    </div>
);

const MapaProductos = () => {
    const imagenURL = "https://via.placeholder.com/500x300"; // URL de la imagen (puedes cambiarla)

    return (
        <div className="space-y-12">
            <section className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                <SectionHeader
                    icon={Database}
                    title="Mapa de Productos - Categorías"
                    subtitle="Desarrollo de Nuevos Productos"
                    color="bg-blue-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                        <Card>
                            <CardHeader>
                                <CardTitle>Productos</CardTitle>
                                <CardDescription>por Categoría</CardDescription>
                            </CardHeader>
                            <CardContent>
                            <Table>
                                <TableCaption>Productos por Categoría</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead className="hidden w-[100px]">Imagen</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                    <TableCell className="font-medium">
                                    <Img
                                        src={imagenURL || ""}
                                        alt="Mapa de Productos"
                                        className="rounded-lg shadow-md w-full h-full object-cover"
                                        
                                        // Placeholder mientras carga la imagen
                                        loader={<Skeleton className="w-full h-full rounded-lg" />}
                                        
                                        // Placeholder cuando la imagen no está disponible
                                        unloader={
                                            <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg">
                                            <ImageOff className="w-12 h-12 text-gray-500" />
                                            <p className="text-gray-500 text-sm mt-2">Imagen no disponible</p>
                                            </div>
                                        }
                                        />
                          </TableCell>
                                    <TableCell>Paid</TableCell>
                                    <TableCell>Credit Card</TableCell>
                                    <TableCell className="text-right">$250.00</TableCell>
                                    </TableRow>
                                </TableBody>
                                </Table>

                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Marcas Top</CardTitle>
                                <CardDescription>por Categoría</CardDescription>
                            </CardHeader>
                            <CardContent>
                                
                            </CardContent>
                        </Card>
                    

                </div>

            


            </section>
        </div>

    );
};

export default MapaProductos;
