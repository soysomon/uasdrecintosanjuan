import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader, 
  Users, 
  UserPlus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  X,
  Check,
  Shield,
  Key
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import API_ROUTES from '../config/api';

interface User {
  id: string;
  username: string;
  role: string;
  active: boolean;
  lastLogin?: string;
  createdAt: string;
  isBlocked: boolean;
  timeLeft: number;
  failedLoginAttempts: number;
}

interface UserManagerProps {
  token: string | null;
}

const UserManager: React.FC<UserManagerProps> = ({ token }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'changePassword'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'superadmin'>('admin');
  const [active, setActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('No hay token de autenticación disponible.');
      return;
    }
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_ROUTES.USERS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al cargar usuarios.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setRole('admin');
    setActive(true);
    setShowPassword(false);
    setSelectedUser(null);
  };

  const openCreateModal = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setUsername(user.username);
    setPassword('');
    setConfirmPassword('');
    setRole(user.role as 'admin' | 'superadmin');
    setActive(user.active);
    setModalMode('edit');
    setShowModal(true);
  };

  const openChangePasswordModal = (user: User) => {
    setSelectedUser(user);
    setPassword('');
    setConfirmPassword('');
    setModalMode('changePassword');
    setShowModal(true);
  };

  const handleCreateUser = async () => {
    if (!username || !password) {
      toast.error('El nombre de usuario y la contraseña son obligatorios.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const res = await axios.post(
        API_ROUTES.USERS,
        { username, password, role, active },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Usuario "${username}" creado exitosamente.`);
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al crear usuario.');
      console.error(err);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    if (!username) {
      toast.error('El nombre de usuario es obligatorio.');
      return;
    }

    // Si se proporciona contraseña, validar
    if (password) {
      if (password !== confirmPassword) {
        toast.error('Las contraseñas no coinciden.');
        return;
      }
      if (password.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
    }

    try {
      const updateData: any = { username, role, active };
      if (password) {
        updateData.password = password;
      }

      await axios.put(
        API_ROUTES.USER_BY_ID(selectedUser.id),
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Usuario "${username}" actualizado exitosamente.`);
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al actualizar usuario.');
      console.error(err);
    }
  };

  const handleChangePassword = async () => {
    if (!selectedUser) return;

    if (!password || !confirmPassword) {
      toast.error('Debes ingresar la nueva contraseña dos veces.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      await axios.put(
        API_ROUTES.USER_BY_ID(selectedUser.id),
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Contraseña de "${selectedUser.username}" actualizada exitosamente.`);
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al cambiar contraseña.');
      console.error(err);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`¿Estás seguro de eliminar al usuario "${user.username}"?`)) {
      return;
    }

    try {
      await axios.delete(
        API_ROUTES.USER_BY_ID(user.id),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Usuario "${user.username}" eliminado exitosamente.`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al eliminar usuario.');
      console.error(err);
    }
  };

  const handleSubmit = () => {
    if (modalMode === 'create') {
      handleCreateUser();
    } else if (modalMode === 'edit') {
      handleUpdateUser();
    } else if (modalMode === 'changePassword') {
      handleChangePassword();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-xl rounded-2xl p-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <Users className="mr-2 text-blue-600" size={22} />
          Gestión de Usuarios
        </h2>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={18} />
          Crear Usuario
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin text-blue-600" size={32} />
          <span className="ml-3 text-blue-600 font-medium">Cargando usuarios...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs uppercase bg-gray-50">
              <tr>
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Último Acceso</th>
                <th className="py-3 px-4">Creado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{user.username}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'superadmin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'superadmin' && <Shield size={12} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {user.isBlocked ? (
                      <span className="text-red-600 font-medium">
                        Bloqueado ({user.timeLeft} min)
                      </span>
                    ) : user.active ? (
                      <span className="text-green-600 font-medium">Activo</span>
                    ) : (
                      <span className="text-gray-500">Inactivo</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleDateString('es-ES')
                      : 'Nunca'}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(user.createdAt).toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar usuario"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => openChangePasswordModal(user)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Cambiar contraseña"
                      >
                        <Key size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar usuario"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="text-center text-gray-500 py-8">No hay usuarios registrados.</p>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {modalMode === 'create' && 'Crear Nuevo Usuario'}
                  {modalMode === 'edit' && 'Editar Usuario'}
                  {modalMode === 'changePassword' && 'Cambiar Contraseña'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {modalMode !== 'changePassword' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre de Usuario
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="usuario123"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rol
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as 'admin' | 'superadmin')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="active"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="active" className="text-sm font-medium text-gray-700">
                        Usuario Activo
                      </label>
                    </div>
                  </>
                )}

                {(modalMode === 'create' || modalMode === 'changePassword') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {modalMode === 'changePassword' ? 'Nueva Contraseña' : 'Contraseña'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Mínimo 6 caracteres"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar Contraseña
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Repetir contraseña"
                      />
                    </div>
                  </>
                )}

                {modalMode === 'edit' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nueva Contraseña (opcional)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Dejar vacío para no cambiar"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {password && (
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                        placeholder="Confirmar nueva contraseña"
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  {modalMode === 'create' ? 'Crear' : 'Guardar'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toaster position="top-right" />
    </motion.div>
  );
};

export default UserManager;