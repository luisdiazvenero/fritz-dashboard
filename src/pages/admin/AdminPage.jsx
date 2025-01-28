import React, { useState } from 'react';
import { Globe, Share2, BarChart2, FileText, ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import UserManagement from './components/UserManagement';
import DataImport from './components/DataImport';
import MetricsManagement from './components/MetricsManagement';
import ActivityLogs from './components/ActivityLogs';
import { Link } from 'react-router-dom';

const NavItem = ({ icon: Icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
        active ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
      }`}
    >
      <Icon className={`h-5 w-5 ${active ? 'text-blue-700' : 'text-gray-500'}`} />
      <span className="ml-2 font-medium hidden group-hover:block">{label}</span>
    </button>
  );
};

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('metrics');

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Cabecera */}
      <header className="h-16 bg-white border-b px-2 flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="pl-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">M</div>
          </div>
          <h1 className="ml-3 text-lg font-bold text-gray-700">Admin Panel</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <ChevronLeft className="h-4 w-4" />
          <Link to="/" className="text-white">Volver</Link>
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Barra Lateral */}
        <div className="group w-16 hover:w-64 transition-all duration-300 ease-in-out bg-white border-r">
          <nav className="flex flex-col h-full py-4">
            <div className="space-y-1 px-2">
            <NavItem
                icon={BarChart2}
                label="Métricas"
                active={activeTab === 'metrics'}
                onClick={() => setActiveTab('metrics')}
              />
              <NavItem
                icon={Globe}
                label="Usuarios"
                active={activeTab === 'users'}
                onClick={() => setActiveTab('users')}
              />
              <NavItem
                icon={Share2}
                label="Importar Datos"
                active={activeTab === 'import'}
                onClick={() => setActiveTab('import')}
              />
              
              <NavItem
                icon={FileText}
                label="Logs"
                active={activeTab === 'logs'}
                onClick={() => setActiveTab('logs')}
              />
            </div>
          </nav>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} className="space-y-6">
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
              <TabsContent value="import">
                <DataImport />
              </TabsContent>
              <TabsContent value="metrics">
                <MetricsManagement />
              </TabsContent>
              <TabsContent value="logs">
                <ActivityLogs />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
