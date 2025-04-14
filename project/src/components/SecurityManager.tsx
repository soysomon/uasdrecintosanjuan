import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader, Users, AlertTriangle } from 'lucide-react';
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

interface BlockedIp {
  ip: string;
  failedAttempts: number;
  lastAttempt: string;
  lockUntil?: string;
  blockLevel: number;
  timeLeft: number;
}

interface SecurityManagerProps {
  token: string | null; // Actualizado para aceptar null
}

const SecurityManager: React.FC<SecurityManagerProps> = ({ token }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [blockedIps, setBlockedIps] = useState<BlockedIp[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('No hay token de autenticación disponible.');
      return;
    }
    fetchUsers();
    fetchBlockedIps();
  }, [token]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_ROUTES.USERS, {
                headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error('Error al cargar usuarios.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockedIps = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_ROUTES.AUTH_BLOCKED_IPS, {
                headers: { Authorization: `Bearer ${token}` },
      });
      setBlockedIps(res.data.blockedIps);
    } catch (err) {
      toast.error('Error al cargar IPs bloqueadas.');
      console.error(err);
    } finally {
      setLoading(false);
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
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <Users className="mr-2 text-purple-600" size={22} />
        Gestión de Seguridad
      </h2>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin text-purple-600" size={32} />
          <span className="ml-3 text-purple-600 font-medium">Cargando datos...</span>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Usuarios Bloqueados</h3>
            {users.filter(user => user.isBlocked).length === 0 ? (
              <p className="text-gray-500">No hay usuarios bloqueados actualmente.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs uppercase bg-gray-50">
                    <tr>
                      <th className="py-3 px-4">Usuario</th>
                      <th className="py-3 px-4">Rol</th>
                      <th className="py-3 px-4">Intentos Fallidos</th>
                      <th className="py-3 px-4">Tiempo Restante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(user => user.isBlocked).map(user => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{user.username}</td>
                        <td className="py-3 px-4">{user.role}</td>
                        <td className="py-3 px-4">{user.failedLoginAttempts}</td>
                        <td className="py-3 px-4">{user.timeLeft} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">IPs Bloqueadas</h3>
            {blockedIps.length === 0 ? (
              <p className="text-gray-500">No hay IPs bloqueadas actualmente.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs uppercase bg-gray-50">
                    <tr>
                      <th className="py-3 px-4">IP</th>
                      <th className="py-3 px-4">Intentos Fallidos</th>
                      <th className="py-3 px-4">Último Intento</th>
                      <th className="py-3 px-4">Tiempo Restante</th>
                      <th className="py-3 px-4">Nivel de Bloqueo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blockedIps.map(ip => (
                      <tr key={ip.ip} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{ip.ip}</td>
                        <td className="py-3 px-4">{ip.failedAttempts}</td>
                        <td className="py-3 px-4">{new Date(ip.lastAttempt).toLocaleString()}</td>
                        <td className="py-3 px-4">{ip.timeLeft} min</td>
                        <td className="py-3 px-4">{ip.blockLevel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
      <Toaster />
    </motion.div>
  );
};

export default SecurityManager;