import { useEffect } from 'react';
import { buscarEstudianteLogic } from './meritoriosLogic';
import './meritorios.css';
import { gsap } from 'gsap';

export default function MeritoriosPage() {
  useEffect(() => {
    buscarEstudianteLogic();

    // GSAP animation for welcome message
    gsap.to('.welcome-message', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, []);

  return (
    <div className="body" style={{ marginTop: '99px' }}>
      <div className="header">
        <div className="header-title">UASD • RECINTO • SAN JUAN</div>
      </div>
      <main className="hero">
        <section className="hero-info">
          <h1 className="hero-title">
            ¡Descubre si eres<br />
            <span className="highlight">Estudiante Meritorio</span>
          </h1>
          <div className="hero-period">2024-20</div>
          <div className="hero-desc">
            Ingresa tu matrícula para verificar si formas parte de la lista de excelencia académica <b>UASD</b>.
          </div>
          <div className="welcome-message">
            Ingresa tu matrícula para consultar tu estado.
          </div>
          <form id="consultaForm" className="consulta-form" autoComplete="off">
            <label htmlFor="matricula">Matrícula universitaria</label>
            <input
              type="text"
              id="matricula"
              name="matricula"
              maxLength={15}
              placeholder="Ej: 100123456"
              required
              aria-required="true"
            />
            <button
              type="button"
              id="buscarBtn"
              aria-label="Consultar estado de estudiante meritorio"
            >
              Consultar
            </button>
            <div id="loading" className="loading">
              <div className="loading-spinner"></div>
              <p>Consultando datos...</p>
            </div>
            <div id="certificateLoading" className="certificate-loading">
              <div className="certificate-spinner"></div>
              <p>Preparando tu certificado...</p>
            </div>
            <div id="resultado" className="resultado"></div>
            <button
              id="downloadButton"
              className="download-btn"
              style={{ display: 'none' }}
              aria-label="Descargar certificado"
            >
              Descargar Certificado
            </button>
            <a
              id="downloadLink"
              className="download-btn"
              style={{ display: 'none' }}
              download
              href="#"
              aria-label="Descargar certificado nuevamente"
            >
              Descargar nuevamente
            </a>
          </form>
        </section>
        <aside className="hero-image-panel">
          <div className="img-card-container">
            <img
              className="img-student-protruding-top"
              src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/news_images/MERITO-POST-WEB.jpg"
              alt="Estudiantes meritorios UASD"
              loading="lazy"
            />
          </div>
          <div className="info-cards-horizontal">
            <div className="card-horizontal gold">
              <span className="mini-icon">🏆</span>
              <div className="card-horizontal-text">
                <div className="title">Excelencia Académica</div>
                <div className="desc">Reconoce tu esfuerzo y dedicación.</div>
              </div>
            </div>
            <div className="card-horizontal">
              <span className="mini-icon">🎓</span>
              <div className="card-horizontal-text">
                <div className="title">Estudiante Meritorio</div>
                <div className="desc">Destaca entre los mejores.</div>
              </div>
            </div>
          </div>
          <div className="info-cards">
            <div className="card-mini gold">
              <span className="mini-icon" style={{ background: 'var(--accent)' }}>🏆</span>
              Excelencia
            </div>
            <div className="card-mini">
              <span className="mini-icon" style={{ background: 'var(--primary)' }}>🎓</span>
              Mérito
            </div>
            <div className="card-mini">
              <span className="mini-icon" style={{ background: 'var(--neutral)' }}>🌟</span>
              UASD
            </div>
          </div>
        </aside>
      </main>
      <footer className="footer">
        DR. CARLOS SANCHEZ DE OLEO • <span>DIRECTOR UASD RECINTO SAN JUAN</span>
      </footer>
    </div>
  );
}