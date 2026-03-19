import React from 'react';
import { Toaster } from 'react-hot-toast';
import MemoriasManager from '../../components/MemoriasManager';
import AdminShell from '../../components/admin/AdminShell';

const MemoriasEditorPage: React.FC = () => {
  return (
    <AdminShell title="Editor de memorias" subtitle="CONTENIDO">
      <div className="adm-page-header adm-section-enter">
        <div className="adm-page-label">Memorias institucionales</div>
        <h1 className="adm-page-title">Editor de Memorias</h1>
      </div>

      <MemoriasManager />

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '8px',
            background: 'var(--adm-paper)',
            border: '1px solid var(--adm-rule)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            fontSize: '13px',
            color: 'var(--adm-ink)',
          },
        }}
      />
    </AdminShell>
  );
};

export default MemoriasEditorPage;
