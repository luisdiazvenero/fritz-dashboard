import React, { useState } from 'react';
import {
  Globe,
  Share2,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut
} from 'lucide-react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import WebMetrics from './WebMetrics';
import SocialMetrics from './SocialMetrics';
import AdsMetrics from './AdsMetrics';
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import Footer from '../ui/Footer';
import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';


const NavItem = ({ icon: Icon, label, active, onClick, href }) => {
  const Component = href ? 'Link' : 'button';
  return (
    <Component
      onClick={onClick}
      to={href}
      className={`flex items-center w-full px-3 py-2 rounded-md transition-colors whitespace-nowrap
       ${active
          ? 'bg-blue-50 text-blue-700'
          : 'hover:bg-gray-100 text-gray-700'
        }`}
    >
      <Icon className={`h-5 w-5 ${active ? 'text-blue-700' : 'text-gray-500'}`} />
      <span className="ml-2 font-medium hidden group-hover:block">
        {label}
      </span>
    </Component>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('web');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth(), 0), // Último día del mes anterior
  });
  
  const previousDateRange = {
    from: new Date(dateRange.from.getFullYear(), dateRange.from.getMonth() - 1, 1),
    to: new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), 0)
  };

  console.log("Rango inicial en Dashboard:", dateRange);
  console.log("Rango previo en Dashboard:", previousDateRange);



  const getActivePageTitle = () => {
    switch (activeTab) {
      case 'web': return 'Métricas Web';
      case 'social': return 'Redes Sociales';
      case 'ads': return 'Inversión en Medios';
      default: return '';
    }
  };

  // Función para formatear fecha
  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      year: 'numeric'
    });
  };

  // Función para cambiar mes
  const changeMonth = (offset) => {
    console.log('Fecha actual antes de cambiar:', dateRange);
  
    const newFrom = new Date(dateRange.from.getFullYear(), dateRange.from.getMonth() + offset, 1);
  const newTo = new Date(newFrom.getFullYear(), newFrom.getMonth() + 1, 0); // Último día del mes
  
  
  console.log("Cambiando mes: Desde", newFrom, "Hasta", newTo);
  setDateRange({ from: newFrom, to: newTo });
  };
  


  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Header Principal */}
      <header className="h-16 bg-white border-b px-2 flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="pl-2"> {/* Alineado con el menú */}
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
              M
            </div>
          </div>
          <div className="flex items-center ml-3">
            <h1 className="text-base font-bold text-gray-500">Dashboard</h1>
            <span className="mx-2 text-gray-300">|</span>
            <h2 className="text-base font-normal text-gray-500">{getActivePageTitle()}</h2>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              console.log("Botón < clickeado");
              changeMonth(-1);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <DateRangePicker
             dateRange={dateRange}
             onDateRangeChange={(newRange) => {
               console.log("Rango actualizado desde DateRangePicker:", newRange);
               setDateRange(newRange);
             }}
             changeMonth={changeMonth}
          />


          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              console.log("Botón > clickeado");
              changeMonth(1);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="h-6 w-px bg-gray-200 mx-2" /> {/* Separador vertical */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-500 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Contenedor Principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="group w-16 hover:w-64 transition-all duration-300 ease-in-out bg-white border-r">
          <nav className="flex flex-col h-full py-4">
            <div className="space-y-1 px-2">
              <NavItem
                icon={Globe}
                label="Web"
                active={activeTab === 'web'}
                onClick={() => setActiveTab('web')}
              />
              <NavItem
                icon={Share2}
                label="Redes Sociales"
                active={activeTab === 'social'}
                onClick={() => setActiveTab('social')}
              />
              <NavItem
                icon={DollarSign}
                label="Inversión en Medios"
                active={activeTab === 'ads'}
                onClick={() => setActiveTab('ads')}
              />
            </div>

            {/* Admin link */}
            {['admin', 'editor'].includes(user?.role) && ( // Verifica el rol aquí
              <div className="mt-auto px-2">
                <div className="border-t my-4"></div> {/* Línea divisoria */}
                <Link to="/admin" className="w-full">
                  <NavItem
                    icon={Settings}
                    label="Admin"
                  />
                </Link>
              </div>
            )}


          </nav>
        </div>

        {/* Contenido Principal con Scroll */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <main className="px-6 py-4">
            <Tabs value={activeTab} className="space-y-6">
              <TabsContent value="web">
                <WebMetrics dateRange={dateRange} previousDateRange={previousDateRange}/>
              </TabsContent>

              <TabsContent value="social">
                <SocialMetrics dateRange={dateRange} previousDateRange={previousDateRange}/>
              </TabsContent>

              <TabsContent value="ads">
                <AdsMetrics dateRange={dateRange} previousDateRange={previousDateRange}/>
              </TabsContent>
            </Tabs>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;