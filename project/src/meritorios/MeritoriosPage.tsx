import { useEffect } from 'react';
import { buscarEstudianteLogic } from './meritoriosLogic';
import './meritorios.css'; // Import the CSS file

export default function MeritoriosPage() {
  useEffect(() => {
    buscarEstudianteLogic(); // Initialize the logic on page load
  }, []);

  return (
    // Añadido style con marginTop para crear espacio bajo la barra de navegación
    <div className="body" style={{ marginTop: '70px' }}>
      <div className="header">
        <img
          className="header-logo"
          src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/LOGO-RECINTO-UASD-SAN-JUAN-AZUL-2.png"
          alt="UASD Logo"
        />
        <div className="header-title">UASD • Consulta de Meritorios</div>
      </div>
      <main className="hero">
        <section className="hero-info">
          <h1 className="hero-title">
            ¡Descubre si eres<br />
            <span className="highlight">Estudiante Meritorio</span>
          </h1>
          <div className="hero-period">2024-20</div>
          <div className="hero-desc">
            Ingresa tu matrícula y conoce si formas parte de la lista de excelencia académica <b>UASD</b>.
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
            />
            <button type="button" id="buscarBtn" onClick={buscarEstudianteLogic}>
              Consultar
            </button>
            <div id="loading" className="loading">
              <div className="loading-spinner"></div>
              <p>Consultando datos...</p>
            </div>
            <div id="resultado" className="resultado"></div>
            <button id="downloadButton" style={{ display: 'none' }}>
              Descargar Certificado
            </button>
            <a id="downloadLink" style={{ display: 'none' }} download>
              Descargar
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
              <span className="mini-icon" style={{ background: 'var(--dorado)' }}>🏆</span>
              Excelencia
            </div>
            <div className="card-mini">
              <span className="mini-icon" style={{ background: 'var(--azul-uasd)' }}>🎓</span>
              Mérito
            </div>
            <div className="card-mini">
              <span className="mini-icon" style={{ background: 'var(--azul-claro)' }}>🌟</span>
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