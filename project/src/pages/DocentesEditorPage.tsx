import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { User, BookOpen, ExternalLink } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import DocentesManager from '../components/DocentesManager';
import PublicacionesDocentesManager from '../components/PublicacionesDocentesManager';
import AdminShell from '../components/admin/AdminShell';

const tabVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

const DocentesEditorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'docentes' | 'publicaciones'>('docentes');

  const topbarRight = (
    <a
      href="/docentes-page"
      target="_blank"
      rel="noopener noreferrer"
      className="adm-btn adm-btn-secondary adm-btn-sm"
    >
      <ExternalLink size={12} />
      Ver página pública
    </a>
  );

  return (
    <AdminShell title="Gestión de docentes" subtitle="ACADÉMICO" topbarRight={topbarRight}>

      <div className="adm-page-header adm-section-enter">
        <div className="adm-page-label">Recursos académicos</div>
        <h1 className="adm-page-title">Gestión de Docentes</h1>
      </div>

      <div className="adm-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'docentes'}
          onClick={() => setActiveTab('docentes')}
          className={`adm-tab${activeTab === 'docentes' ? ' active' : ''}`}
        >
          <User size={13} />
          Perfiles de docentes
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'publicaciones'}
          onClick={() => setActiveTab('publicaciones')}
          className={`adm-tab${activeTab === 'publicaciones' ? ' active' : ''}`}
        >
          <BookOpen size={13} />
          Conoce tu docente
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {activeTab === 'docentes'
            ? <DocentesManager />
            : <PublicacionesDocentesManager />
          }
        </motion.div>
      </AnimatePresence>

      <Toaster position="bottom-right" />
    </AdminShell>
  );
};

export default DocentesEditorPage;
