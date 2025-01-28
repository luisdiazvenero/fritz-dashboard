import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import useUserStore from '@/store/userStore';

const DeleteUserDialog = ({ isOpen, onClose, onConfirm, username, isAdmin, isLastAdmin }) => {
  // Obtenemos isLoading del store
  const isLoading = useUserStore(state => state.isLoading);

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      // El error se maneja en el componente padre
      console.error('Error en eliminación:', error);
    }
  };

  const getWarningMessage = () => {
    if (isAdmin && isLastAdmin) {
      return "No se puede eliminar el último administrador del sistema.";
    }
    if (isAdmin) {
      return "ADVERTENCIA: Estás eliminando un usuario con rol de Administrador.";
    }
    return `Esta acción eliminará al usuario ${username} y no se puede deshacer.`;
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription className={isAdmin ? 'text-red-600 font-medium' : ''}>
            {getWarningMessage()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading || (isAdmin && isLastAdmin)}
            className={`bg-red-600 hover:bg-red-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Eliminando...</span>
              </div>
            ) : (
              'Eliminar'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;