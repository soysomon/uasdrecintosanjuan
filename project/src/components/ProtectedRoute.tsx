import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC<{ allowedRoles: string[] }> = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  let user = null;

  if (token) {
    try {
      console.log("📌 Token encontrado en localStorage:", token);
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        console.log("✅ Usuario decodificado:", payload);
        user = payload;
      } else {
        console.warn("⚠️ Token con formato incorrecto.");
      }
    } catch (error) {
      console.error("❌ Error al decodificar el token:", error);
      localStorage.removeItem('token'); // Elimina el token corrupto
    }
  } else {
    console.warn("⚠️ No hay token almacenado.");
  }

  if (!user || !allowedRoles.includes(user.role)) {
    console.warn("🚫 Usuario no autorizado. Redirigiendo...");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
