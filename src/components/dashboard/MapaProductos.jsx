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
import { Database } from 'lucide-react';
import EmojiBox from "@/components/ui/EmojiBox"; 

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
    const imagenURL = "https://shipixen.com/placeholder.svg"; // URL de la imagen (puedes cambiarla)

    return (
        <div className="space-y-12">
            <section className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                <SectionHeader
                    icon={Database}
                    title="Mapa de Productos"
                    subtitle="Desarrollo de Nuevos Productos"
                    color="bg-blue-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-md">Categorías de Productos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table className="table-fixed w-full">
                                
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12 text-center">#</TableHead> {/* Número pequeño */}
                                        <TableHead className="w-32 text-center"></TableHead> {/* Tamaño fijo para imagen */}
                                        <TableHead className="p-2 text-left">Categorías</TableHead> {/* Se expande automáticamente */}
                                        <TableHead className="p-2 text-left">Sub Categorías</TableHead>
                                        <TableHead className="p-2 text-left">Marcas Top</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    
                                    <TableRow> 
                                        <TableCell className="p-2 w-12 text-center">
                                        <span className="bg-blue-500 text-white text-sm font-black px-2 py-1 rounded-xl">1</span>
                                        </TableCell>
                                        <TableCell className="p-0 text-center">
                                            <EmojiBox emojis={["🍚", "🫘", "🍞"]} />
                                        </TableCell>
                                        <TableCell className="p-2 text-left">Cereales, Granos y  Carbohidratos</TableCell>
                                        <TableCell className="p-2 text-left text-xs text-gray-500">Arroz, Harina, Pasta, Avena, Legumbres, Pan, Café, Cereales Azucarados</TableCell>
                                        <TableCell className="p-2 text-left">Amanecer, Mary, PAN, Primor</TableCell>
                                    </TableRow>

                                    <TableRow> 
                                        <TableCell className="p-2 w-12 text-center">
                                        <span className="bg-blue-500 text-white text-sm font-black px-2 py-1 rounded-xl">2</span>
                                        </TableCell>
                                        <TableCell className="p-0 text-center">
                                            <EmojiBox emojis={["🍎", "🥦", "🥕"]} />
                                        </TableCell>

                                        <TableCell className="p-2 text-left">Frutas, verduras y Tubérculos</TableCell>
                                        <TableCell className="p-2 text-left text-xs text-gray-500">Frutas, Vegetales, Verduras, Tuberculos</TableCell>
                                        <TableCell className="p-2 text-left">Frutas, Vegetales, Verduras, Tuberculos</TableCell>
                                    </TableRow>

                                    <TableRow> 
                                        <TableCell className="p-2 w-12 text-center">
                                        <span className="bg-blue-500 text-white text-sm font-black px-2 py-1 rounded-xl">3</span>
                                        </TableCell>
                                        <TableCell className="p-2 w-16 text-center">
                                         <EmojiBox emojis={["🍗", "🥩", "🐟"]} />
                                        </TableCell>
                                        <TableCell className="p-2 text-left">Proteínas</TableCell>
                                        <TableCell className="p-2 text-left text-xs text-gray-500">Pollo, Cerdo, Res, Pescado y mariscos, Cordero, Huevos
</TableCell>
                                        <TableCell className="p-2 text-left">Alimentos El Tunal, del corral, Purolomo</TableCell>
                                    </TableRow>

                                    <TableRow> 
                                        <TableCell className="p-2 w-12 text-center">
                                        <span className="bg-blue-500 text-white text-sm font-black px-2 py-1 rounded-xl">4</span>
                                        </TableCell>
                                        <TableCell className="p-2 w-16 text-center">
                                            <EmojiBox emojis={["🥛", "🍦", "🧃"]} />
                                        </TableCell>
                                        <TableCell className="p-2 text-left">Lácteos y derivados</TableCell>
                                        <TableCell className="p-2 text-left text-xs text-gray-500">Leche, Bebidas lácteas, Yogurt, Mantequillas</TableCell>
                                        <TableCell className="p-2 text-left">Nestle, Paisa, Purisima</TableCell>
                                    </TableRow>

                                    <TableRow> 
                                        <TableCell className="p-2 w-12 text-center">
                                        <span className="bg-blue-500 text-white text-sm font-black px-2 py-1 rounded-xl">5</span>
                                        </TableCell>
                                        <TableCell className="p-2 w-16 text-center">
                                            <EmojiBox emojis={["🍖", "🌭", "🥓"]} />
                                        </TableCell>
                                        <TableCell className="p-2 text-left">Embutidos</TableCell>
                                        <TableCell className="p-2 text-left text-xs text-gray-500">Jamón, Salchicha, Mortadela, Morcilla, Chorizo, Salami
</TableCell>
                                        <TableCell className="p-2 text-left">Plumrose, Purolomo, L´Prado</TableCell>
                                    </TableRow>

                                    <TableRow> 
                                        <TableCell className="p-2 w-12 text-center">
                                        <span className="bg-blue-500 text-white text-sm font-black px-2 py-1 rounded-xl">6</span>
                                        </TableCell>
                                        <TableCell className="p-2 w-16 text-center">
                                        <EmojiBox emojis={["🫒", "🧈", "🥜"]} />
                                        </TableCell>
                                        <TableCell className="p-2 text-left">Grasas y aceites</TableCell>
                                        <TableCell className="p-2 text-left text-xs text-gray-500">Aceite, Mantequilla de maní, Margarina, Otras grasas</TableCell>
                                        <TableCell className="p-2 text-left">Mavesa, Nelly, Vatel</TableCell>
                                    </TableRow>

                                    <TableRow> 
                                        <TableCell className="p-2 w-12 text-center">
                                        <span className="bg-blue-500 text-white text-sm font-black px-2 py-1 rounded-xl">7</span>
                                        </TableCell>
                                        <TableCell className="p-2 w-16 text-center">
                                        <EmojiBox emojis={["🍯", "🍫", "🍪"]} />
                                        </TableCell>
                                        <TableCell className="p-2 text-left">Dulces y Snack</TableCell>
                                        <TableCell className="p-2 text-left text-xs text-gray-500">Azucar y endulzantes, Gelatinas y pudin, Caramelos, Chocolates, Galletas y ponqués, Papas y tostones, Compotas y mermeladas, Helados, Frutos secos</TableCell>
                                        <TableCell className="p-2 text-left">Mondelez, Munchy, Nestle, Pepsico</TableCell>
                                    </TableRow>

                                    <TableRow> 
                                        <TableCell className="p-2 w-12 text-center">
                                        <span className="bg-blue-500 text-white text-sm font-black px-2 py-1 rounded-xl">8</span>
                                        </TableCell>
                                        <TableCell className="p-2 w-16 text-center">
                                            <EmojiBox emojis={[ "💧", "🥤", "⚡"]} />
                                        </TableCell>
                                        <TableCell className="p-2 text-left">Bebidas</TableCell>
                                        <TableCell className="p-2 text-left text-xs text-gray-500">Jugo de frutas, Agua, Gaseosa, Malta, Bebidas achoco, Bebidas energizantes, Té</TableCell>
                                        <TableCell className="p-2 text-left">Coca Cola, Natulac, Nestle, Pepsi</TableCell>
                                    </TableRow>

                                    <TableRow> 
                                        <TableCell className="p-2 w-12 text-center">
                                        <span className="bg-blue-500 text-white text-sm font-black px-2 py-1 rounded-xl">9</span>
                                        </TableCell>
                                        <TableCell className="p-2 w-16 text-center">
                                        <EmojiBox emojis={["🥫", "🌶️", "🧂"]} />
                                        </TableCell>
                                        <TableCell className="p-2 text-left">Salsas, aderezos y condimentos</TableCell>
                                        <TableCell className="p-2 text-left text-xs text-gray-500">Ketchup, Mostaza, Mayonesa, Salsas saborizadas, Vinagre, Sasonadores, Bases en polvo, Condimentos</TableCell>
                                        <TableCell className="p-2 text-left">Iberia, Kraft Heinz, Mc Cornick, Pampero</TableCell>
                                    </TableRow>

                                    <TableRow> 
                                        <TableCell className="p-2 w-12 text-center">
                                        <span className="bg-blue-500 text-white text-sm font-black px-2 py-1 rounded-xl">10</span>
                                        </TableCell>
                                        <TableCell className="p-2 w-16 text-center">
                                            <EmojiBox emojis={["🧻", "🍽️", "♻️"]} />
                                        </TableCell>
                                        <TableCell className="p-2 text-left">Desechables Food Service</TableCell>
                                        <TableCell className="p-2 text-left text-xs text-gray-500">Servilletas, Utensilios, Envases, Papel aluminio, Otros</TableCell>
                                        <TableCell className="p-2 text-left">Selva</TableCell>
                                    </TableRow>

                                </TableBody>
                            </Table>

                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Participación de Fritz</CardTitle>
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
