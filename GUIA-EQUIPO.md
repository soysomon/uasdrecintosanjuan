# Guía de trabajo — Sitio Web UASD Recinto San Juan

Esta guía explica cómo instalar todo lo necesario, cómo abrir el proyecto en tu computadora y cómo hacer cambios de forma segura.

---

## PASO 1 — Instalar las herramientas

Instala estas tres herramientas en orden. Solo se hace una vez.

### 1.1 Visual Studio Code (el editor de código)
- Descarga desde: https://code.visualstudio.com
- Instala normalmente como cualquier programa
- Es el programa donde vas a abrir y editar los archivos del sitio

### 1.2 Node.js (motor que hace funcionar el sitio en tu computadora)
- Descarga desde: https://nodejs.org
- Descarga la versión que dice **LTS** (la recomendada)
- Instala normalmente
- Para verificar que quedó instalado, abre la Terminal y escribe:
  ```
  node -v
  ```
  Debe aparecer un número de versión, por ejemplo: `v20.11.0`

### 1.3 GitHub Desktop (para manejar los cambios sin escribir comandos)
- Descarga desde: https://desktop.github.com
- Inicia sesión con tu cuenta de GitHub
- Es la herramienta que usarás para subir tus cambios

---

## PASO 2 — Obtener el proyecto en tu computadora

### 2.1 Clonar el repositorio
1. Abre **GitHub Desktop**
2. Clic en **File → Clone repository**
3. Busca `uasdrecintosanjuan` en la lista
4. Elige una carpeta donde guardarlo (por ejemplo: Documentos)
5. Clic en **Clone**

Esto descarga todos los archivos del sitio en tu computadora.

### 2.2 Abrir el proyecto en VS Code
1. En GitHub Desktop, clic en **Open in Visual Studio Code**
2. VS Code abrirá la carpeta completa del proyecto

---

## PASO 3 — Instalar las dependencias del proyecto

Las dependencias son las librerías que el sitio necesita para funcionar. Solo se instalan una vez (o cuando alguien las actualice).

1. En VS Code, abre la Terminal integrada con: `Ctrl + J` (Windows) o `Cmd + J` (Mac)
2. Escribe este comando y presiona Enter:
   ```
   cd project
   npm install
   ```
3. Espera a que termine. Verás muchos textos corriendo — es normal.
4. Cuando vuelva a aparecer el cursor, terminó.

---

## PASO 4 — Ver el sitio en tu computadora

Para ver el sitio funcionando localmente (sin internet, solo en tu máquina):

```
npm run dev
```

Luego abre tu navegador y escribe: `http://localhost:5173`

Verás el sitio exactamente como se ve en producción. Cada cambio que hagas en los archivos se reflejará automáticamente en el navegador.

Para detener el servidor: presiona `Ctrl + C` en la terminal.

---

## PASO 5 — Cómo hacer cambios de forma segura

**NUNCA trabajes directamente en la rama `master`.** Sigue siempre este proceso:

### 5.1 Crear una rama nueva antes de hacer cualquier cambio
1. En GitHub Desktop: **Branch → New Branch**
2. Ponle un nombre descriptivo, por ejemplo: `content/actualizar-texto-inicio`
3. Clic en **Create Branch**

### 5.2 Hacer tus cambios en VS Code
- Edita los archivos necesarios (ver sección "Qué puedes modificar")
- Guarda con `Ctrl + S` (Windows) o `Cmd + S` (Mac)
- Verifica el cambio en el navegador en `http://localhost:5173`

### 5.3 Subir los cambios
1. En GitHub Desktop verás los archivos que cambiaste
2. Escribe una descripción breve de lo que hiciste (abajo a la izquierda)
3. Clic en **Commit to content/...**
4. Clic en **Push origin**
5. Clic en **Create Pull Request**

El desarrollador principal revisará tu cambio antes de publicarlo en el sitio real.

---

## QUÉ PUEDES MODIFICAR

Estos son los archivos donde puedes hacer cambios con confianza:

| Archivo | Qué contiene |
|---|---|
| `project/src/components/HistoryPage.tsx` | Texto de la página Historia |
| `project/src/components/MisionVisionPage.tsx` | Misión y Visión |
| `project/src/components/PhilosophyPage.tsx` | Filosofía institucional |
| `project/src/components/DirectivosPage.tsx` | Directivos |
| `project/src/components/frequentquestions.tsx` | Preguntas frecuentes |
| `project/src/components/Contact.tsx` | Información de contacto |
| `project/src/components/Footer.tsx` | Pie de página |
| `project/src/components/StatsSection.tsx` | Estadísticas del recinto |
| `project/src/img/` | Imágenes del sitio |

---

## QUÉ NO DEBES TOCAR

Estos archivos controlan el funcionamiento del sistema. Un cambio aquí puede romper el sitio:

| Archivo / Carpeta | Por qué no tocarlo |
|---|---|
| `project/src/auth/` | Sistema de login y seguridad |
| `project/src/config/api.ts` | Conexión con el servidor |
| `project/src/App.tsx` | Estructura de rutas del sitio |
| `project/vite.config.ts` | Configuración del sistema |
| `project/package.json` | Dependencias del proyecto |
| `project/tailwind.config.js` | Configuración de estilos globales |

**Si tienes dudas sobre si puedes tocar algo, pregunta primero.**

---

## PROBLEMAS COMUNES

**"npm: command not found"**
→ Node.js no quedó instalado. Vuelve al Paso 1.2.

**El sitio no carga en localhost:5173**
→ Verifica que `npm run dev` esté corriendo en la terminal. Si lo cerraste, vuelve a ejecutarlo.

**Hice un cambio y el sitio se rompió**
→ En VS Code presiona `Ctrl + Z` para deshacer. O en GitHub Desktop ve a **Changes → Discard Changes** sobre el archivo que modificaste.

**No aparece mi rama en GitHub Desktop**
→ Asegúrate de haber creado la rama antes de hacer cambios (ver Paso 5.1).

---

## CONTACTO TÉCNICO

Cualquier duda que no puedas resolver con esta guía, contacta al desarrollador principal antes de hacer cambios que no estés seguro.
