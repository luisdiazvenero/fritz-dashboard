import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';
import useUserStore from '@/store/userStore';
import UserModal from './UserModal';
import DeleteUserDialog from './DeleteUserDialog';
import { cn } from "@/lib/utils";

const UserManagement = () => {
  const { toast } = useToast(); 
  const { users, fetchUsers, deleteUser, error, clearError } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const showNotification = (type, message) => {
    const notificationConfig = {
      success: {
        title: "Éxito",
        description: message,
        className: "bg-green-50 border-green-200 text-green-800",
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      },
      error: {
        title: "Error",
        description: message,
        className: "bg-red-50 border-red-200 text-red-800",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      },
      warning: {
        title: "Advertencia",
        description: message,
        className: "bg-yellow-50 border-yellow-200 text-yellow-800",
        icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      },
      info: {
        title: "Información",
        description: message,
        className: "bg-blue-50 border-blue-200 text-blue-800",
        icon: <Info className="h-5 w-5 text-blue-500" />,
      }
    };
  
    const config = notificationConfig[type] || {
      title: "Notificación",
      description: message,
      className: "bg-gray-50 border-gray-200 text-gray-800",
    };
  
    toast({
      ...config,
      duration: 3000,
    });
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        console.log('Iniciando carga de usuarios...');
        const result = await fetchUsers();
        console.log('Usuarios cargados:', result);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    };
    
    loadUsers();
  }, [fetchUsers]);
  

  useEffect(() => {
    if (error) {
      showNotification('error', error);
      clearError();
    }
  }, [error, clearError]);

  const handleDeleteClick = (user) => {
    // Verifica si es el último admin
    const otherAdmins = users.filter(u => u.role === 'admin' && u._id !== user._id);
    const isLastAdmin = user.role === 'admin' && otherAdmins.length === 0;
    
    setSelectedUser({
      ...user,
      isAdmin: user.role === 'admin',
      isLastAdmin
    });
    setIsDeleteDialogOpen(true);
  };

  const handleNewUser = () => {
    // Remover cualquier lock del scroll antes de abrir el modal
    document.body.style.removeProperty('pointer-events');
    document.body.removeAttribute('data-scroll-locked');
    
    setSelectedUser(null);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(selectedUser._id);
      showNotification('success', `El usuario ${selectedUser.username} ha sido eliminado exitosamente`);
    } catch (error) {
      if (error.message.includes('último administrador')) {
        showNotification('warning', 'No se puede eliminar el último administrador del sistema');
      } else {
        showNotification('error', error.message || 'Error al eliminar el usuario');
      }
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUserAction = (action, username) => {
    if (action === 'create') {
      showNotification('success', `Usuario ${username} creado exitosamente`);
    } else if (action === 'edit') {
      showNotification('success', `Usuario ${username} editado exitosamente`);
    }
  };
  

  const getRoleLabel = (role) => {
    const roles = {
      admin: 'Administrador',
      editor: 'Editor',
      viewer: 'Visor'
    };
    return roles[role] || role;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestión de Usuarios</CardTitle>
        <div className="flex items-center gap-2">
        <Button 
  onClick={handleNewUser}
  className="flex items-center gap-2 bg-black hover:bg-black/90 text-white"
>
  <Plus className="h-4 w-4" />
  Nuevo Usuario
</Button>
          
          
          
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Usuario</th>
                <th className="text-left py-3 px-4">Rol</th>
                <th className="text-left py-3 px-4">Estado</th>
                <th className="text-right py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.username}</td>
                  <td className="py-3 px-4">{getRoleLabel(user.role)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(user)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <UserModal 
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }}
  user={selectedUser}
  onUserAction={handleUserAction} // Pasar la función aquí
/>

        <DeleteUserDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          username={selectedUser?.username}
          isAdmin={selectedUser?.role === 'admin'}
          isLastAdmin={selectedUser?.isLastAdmin}
        />
      </CardContent>
    </Card>
  );
};

export default UserManagement;