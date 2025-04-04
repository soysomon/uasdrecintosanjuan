const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
  console.log('Iniciando generación de PDF...');

  // Verifica si existe el directorio public
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
    console.log('Directorio public creado');
  }

  // Lanza el navegador
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Carga el HTML desde el archivo
  const htmlPath = path.join(__dirname, 'sample-postgrado.html');

  console.log(`Cargando archivo HTML: ${htmlPath}`);
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  // Genera el PDF
  const pdfPath = path.join(__dirname, 'public', 'sample-postgrado.pdf');
  console.log(`Generando PDF en: ${pdfPath}`);

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  });

  // Cierra el navegador
  await browser.close();

  console.log('PDF generado con éxito!');
}

generatePDF().catch(err => {
  console.error('Error generando PDF:', err);
  process.exit(1);
});
