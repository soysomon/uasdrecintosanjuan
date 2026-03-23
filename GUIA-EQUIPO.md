# Guia de trabajo — Equipo UASD Recinto San Juan
### Del Dia 1 al Dia 5: Instalacion, entorno y primeros cambios

---

## Antes de empezar — Que es este proyecto

Este repositorio contiene el **sitio web oficial del UASD Recinto San Juan de la Maguana** (`uasdrecintosanjuan.org`).
Todo lo que modifiques aqui puede afectar el sitio que ven los visitantes — por eso cada cambio pasa por revision antes de publicarse.

El sitio tiene dos partes:

- **Este repositorio (frontend):** lo que el usuario ve — paginas, textos, colores, imagenes.
- **Repositorio del desarrollador (backend):** base de datos, usuarios, seguridad. No tienes acceso y no lo necesitas.

---

## DIA 1 — Instalacion del entorno

### 1.1 Instalar Node.js

Node.js es el motor que necesita el proyecto para funcionar en tu computadora.

1. Ve a `https://nodejs.org`
2. Descarga la version **LTS** (la que dice "Recommended For Most Users")
3. Abre el archivo descargado y sigue los pasos del instalador
4. Cuando termine, abre la **Terminal** (Mac) o el **Simbolo del sistema** (Windows)
5. Escribe lo siguiente y presiona Enter:
   ```
   node --version
   ```
   Si ves algo como `v20.11.0`, la instalacion fue exitosa.

---

### 1.2 Instalar Visual Studio Code

VS Code es el programa donde vas a ver y editar los archivos del sitio.

1. Ve a `https://code.visualstudio.com`
2. Descarga e instala la version para tu sistema operativo
3. Abrelo cuando termine la instalacion

**Instalar el idioma en espanol (recomendado):**
- En el panel izquierdo, haz clic en el icono de cuatro cuadros (Extensions)
- Busca: `Spanish Language Pack for Visual Studio Code`
- Haz clic en **Install**
- VS Code te pedira reiniciar — acepta

---

### 1.3 Instalar GitHub Desktop

GitHub Desktop es la aplicacion que te permite recibir cambios del proyecto y enviar los tuyos, sin usar comandos complejos.

1. Ve a `https://desktop.github.com`
2. Descarga e instala la aplicacion
3. Abrela y haz clic en **Sign in to GitHub.com**
4. Ingresa tu usuario y contrasena de GitHub
5. Cuando te pida nombre y correo, usa tu nombre real (aparece en el historial de cambios)

---

### 1.4 Clonar el repositorio

Clonar significa descargar una copia del proyecto en tu computadora.

1. Abre GitHub Desktop
2. Ve al menu **File → Clone repository**
3. Busca `uasdrecintosanjuan` en la lista
4. En **Local Path**, elige donde guardarlo (ejemplo: `Documentos/uasd`)
5. Haz clic en **Clone** y espera — puede tardar unos minutos

---

### 1.5 Abrir el proyecto en VS Code

1. En GitHub Desktop, haz clic en **Open in Visual Studio Code**
2. VS Code se abre con todos los archivos del proyecto visibles en el panel izquierdo

---

### 1.6 Instalar las dependencias del proyecto

Las dependencias son las librerias que el proyecto necesita. Solo se instalan una vez.

1. En VS Code, abre el terminal integrado: menu **Terminal → New Terminal**
2. En el terminal que aparece abajo, escribe:
   ```
   cd project
   ```
   Presiona Enter. (Esto entra a la carpeta principal del proyecto.)
3. Luego escribe:
   ```
   npm install
   ```
   Presiona Enter. Veras texto corriendo — es normal. Puede tardar 2-3 minutos.

---

### 1.7 Encender el sitio en tu computadora

1. En el mismo terminal escribe:
   ```
   npm run dev
   ```
2. Cuando veas una linea que dice `Local: http://localhost:5173`, el sitio esta encendido
3. Abre tu navegador y ve a `http://localhost:5173`
4. Veras el sitio completo con noticias, docentes y todo el contenido real

> Para apagar el sitio: en el terminal presiona `Ctrl + C`

**Objetivo del Dia 1:** El sitio corre en tu computadora sin errores.

---

## DIA 2 — Conocer la estructura del proyecto

### Que es cada carpeta

En VS Code, en el panel izquierdo, veras esta estructura dentro de la carpeta `project`:

```
project/
  src/
    components/    ← Piezas del sitio (header, footer, secciones)
    pages/         ← Paginas completas (Inicio, Contacto, Noticias...)
    data/          ← Archivos de contenido editable
    styles/        ← Archivos de diseno y colores
    auth/          ← Sistema de seguridad (NO TOCAR)
    api/           ← Conexion con el servidor (NO TOCAR)
```

---

### Lo que puedes modificar y lo que no

| Archivo | Puedes modificarlo | Para que sirve |
|---|---|---|
| `src/data/staticData.ts` | SI | Estadisticas y servicios destacados de la pagina de inicio |
| `src/components/Footer.tsx` | SI | Telefono, correo y redes sociales del pie de pagina |
| `src/components/Contact.tsx` | SI | Numeros de extension y correos del formulario de contacto |
| `src/components/StatsSection.tsx` | SI (solo el ano) | Ano academico visible junto a las estadisticas |
| `src/components/HistoryPage.tsx` | SI | Texto de la pagina de Historia |
| `src/components/MisionVisionPage.tsx` | SI | Texto de Mision y Vision |
| `src/components/frequentquestions.tsx` | SI | Preguntas frecuentes |
| `src/auth/` | NO | Sistema de login y seguridad |
| `src/api/` | NO | Conexion con el servidor |
| `vite.config.ts` | NO | Configuracion tecnica |
| `package.json` | NO | Dependencias del proyecto |
| `tailwind.config.js` | NO | Colores y estilos globales |

**Regla simple: si tienes duda sobre si puedes tocarlo, pregunta primero.**

---

### Ejercicio del Dia 2: identificar donde esta cada cosa

Abre el sitio en `http://localhost:5173` y encuentra en el codigo:

1. El numero de estudiantes activos — esta en `src/data/staticData.ts`
2. El telefono del footer — esta en `src/components/Footer.tsx`
3. El numero principal de contacto — esta en `src/components/Contact.tsx`

Solo observa, no cambies nada todavia.

**Objetivo del Dia 2:** Saber donde buscar cada contenido sin ayuda.

---

## DIA 3 — Tu primer cambio

### El flujo de trabajo (siempre el mismo orden)

```
1. Crear una rama nueva en GitHub Desktop
2. Hacer el cambio en VS Code
3. Verificar que se ve bien en el navegador
4. Guardar el cambio (commit)
5. Enviarlo a GitHub (push)
6. Abrir una solicitud de revision (Pull Request)
7. Avisar al desarrollador
8. Esperar aprobacion — solo entonces llega al sitio real
```

---

### Ejercicio guiado: actualizar el numero de estudiantes

**Escenario de practica:** El numero de estudiantes activos cambio a 13,200.

**Paso 1 — Crear una rama**

En GitHub Desktop:
1. Haz clic en el menu **Branch → New Branch**
2. Escribe el nombre: `contenido/actualizar-estadisticas`
3. Haz clic en **Create Branch**

> Una rama es un espacio separado donde trabajas sin afectar el sitio real. Es como hacer cambios en un borrador antes de imprimir el documento final.

---

**Paso 2 — Abrir el archivo**

En VS Code, en el panel izquierdo:
- Navega hasta: `project → src → data → staticData.ts`
- Haz doble clic para abrirlo

Veras algo como esto:

```javascript
// Este array contiene las estadisticas que aparecen en la pagina de inicio
// Cada linea tiene dos partes: "figure" (el numero) y "label" (la descripcion)
export const institutionalStats = [
  { figure: "71+",    label: "Programas academicos" },
  { figure: "12,807", label: "Estudiantes activos" },   // <- aqui
  { figure: "1+",     label: "Docentes PhD" },
  { figure: "1",      label: "Centros de investigacion" },
];
```

---

**Paso 3 — Hacer el cambio**

Busca la linea de estudiantes con `Ctrl + F` (busca: `Estudiantes activos`).

Cambia:
```
{ figure: "12,807", label: "Estudiantes activos" }
```
Por:
```
{ figure: "13,200", label: "Estudiantes activos" }
```

Guarda con `Ctrl + S`.

---

**Paso 4 — Verificar en el navegador**

Ve a `http://localhost:5173` — baja hasta la seccion de estadisticas. El nuevo numero debe aparecer de inmediato.

---

**Paso 5 — Guardar el cambio (commit)**

En GitHub Desktop:
1. Veras `staticData.ts` marcado con un punto — eso indica que tiene cambios
2. En la esquina inferior izquierda, en el campo **Summary**, escribe:
   ```
   Actualizar numero de estudiantes activos a 13,200
   ```
3. Haz clic en **Commit to contenido/actualizar-estadisticas**

---

**Paso 6 — Enviar a GitHub (push)**

Haz clic en el boton **Push origin** que aparece en la parte superior.

---

**Paso 7 — Abrir Pull Request**

1. GitHub Desktop mostrara el boton **Create Pull Request** — haz clic
2. Se abre GitHub en el navegador
3. En el campo de descripcion, escribe que cambiaste y por que
4. Haz clic en **Create Pull Request**
5. Avisa al desarrollador por el canal acordado

> El cambio **no llega al sitio real** hasta que el desarrollador lo apruebe.

**Objetivo del Dia 3:** Completar el flujo completo de principio a fin, sin errores.

---

## DIA 4 — Cambios reales

### Caso 1: Actualizar el telefono principal de contacto

**Archivo:** `project/src/components/Contact.tsx`

Usa `Ctrl + F` para buscar: `mainNumber`

Encontraras:
```javascript
// Numero principal que aparece en la pagina de Contacto
const contactInfo = {
  mainNumber: '809 557 5575',
```
Cambia el numero entre las comillas. Guarda. Verifica en `http://localhost:5173/contacto`.

---

### Caso 2: Actualizar las extensiones y correos del formulario

**Archivo:** `project/src/components/Contact.tsx`

Busca: `departamentos`

Encontraras una lista como esta:
```javascript
// Cada departamento tiene: un identificador interno (value),
// el nombre que ve el usuario (label) y el correo al que llega el mensaje (email)
const departamentos = [
  { value: 'info',       label: 'Informacion General',   email: 'info@uasdsanjuan.edu.do' },
  { value: 'admisiones', label: 'Admisiones',             email: 'admisiones@uasdsanjuan.edu.do' },
  { value: 'registro',   label: 'Registro',               email: 'registro@uasdsanjuan.edu.do' },
];
```
Solo cambia el valor de `email`. No cambies `value` a menos que sea estrictamente necesario.

Para las extensiones, busca: `extensions`
```javascript
// Lista de departamentos con su numero de extension
extensions: [
  { department: 'Caja',     ext: '109' },
  { department: 'Registro', ext: '128' },
]
```
Cambia el numero de `ext` o el valor de `number` segun corresponda.

---

### Caso 3: Actualizar el telefono y correo del footer

**Archivo:** `project/src/components/Footer.tsx`

Busca: `tel:+1`

Encontraras:
```javascript
// El href="tel:+18095572299" es el numero que marca el telefono cuando el usuario hace clic
// El texto visible (809) 557-2299 es lo que lee el usuario en la pantalla
<a href="tel:+18095572299">
  (809) 557-2299
</a>
```
Actualiza ambos: el numero dentro de `tel:+1` (sin guiones ni espacios) y el texto visible.

Para el correo, busca: `mailto:`
```javascript
// href="mailto:info@uasd.edu.do" es el correo al que se abre el cliente de correo
<a href="mailto:info@uasd.edu.do">
  info@uasd.edu.do
</a>
```
Cambia el correo en `href` y tambien el texto que aparece debajo.

---

### Caso 4: Actualizar el ano academico en estadisticas

**Archivo:** `project/src/components/StatsSection.tsx`

Busca: `Año académico`

Encontraras:
```javascript
{/* Texto que aparece junto a las estadisticas indicando el periodo */}
Año académico 2025
```
Cambia solo el ano. Nada mas en ese archivo.

---

### Caso 5: Actualizar los servicios destacados de la pagina de inicio

**Archivo:** `project/src/data/staticData.ts`

Busca: `featuredServices`

```javascript
// Estos son los cuatro bloques de acceso rapido que aparecen en la pagina de inicio
export const featuredServices = [
  {
    title: "Carreras Universitarias",       // Titulo del bloque
    description: "Explora nuestra oferta academica",  // Descripcion breve
    link: "/carreras/grado",               // A donde lleva el boton (NO cambiar)
  },
```
Puedes cambiar `title` y `description`. No cambies `link`.

---

### Errores comunes y como resolverlos

**El sitio no enciende con `npm run dev`**
- Asegurate de estar en la carpeta correcta — en el terminal debe verse `.../project`
- Si no, escribe `cd project` y luego `npm run dev`

**Hice un cambio y el sitio se rompio (pantalla blanca o texto de error)**
- Presiona `Ctrl + Z` varias veces en VS Code para deshacer
- Si el sitio no vuelve, en GitHub Desktop: clic derecho sobre el archivo → **Discard Changes**
- Esto devuelve el archivo exactamente como estaba

**Borre una linea sin querer**
- En GitHub Desktop, clic derecho sobre el archivo → **Discard Changes**
- Nunca se pierde trabajo mientras no hayas hecho commit

**El terminal dice "command not found"**
- Cierra el terminal y abre uno nuevo: **Terminal → New Terminal**
- Escribe `cd project` y vuelve a intentar

---

**Objetivo del Dia 4:** Ejecutar al menos tres cambios reales de principio a fin, incluyendo un error intencional y su correccion.

---

## DIA 5 — Simulacro independiente

### Tarea del dia (sin asistencia del desarrollador)

El equipo recibe esta lista de cambios para aplicar:

1. Actualizar el numero de estudiantes en `staticData.ts`
2. Actualizar el ano academico en `StatsSection.tsx`
3. Corregir un numero de extension en `Contact.tsx`
4. Actualizar un correo de departamento en `Contact.tsx`

**El proceso completo que deben ejecutar solos:**

1. Crear una rama con nombre descriptivo (`contenido/actualizacion-datos-mayo`)
2. Aplicar los cuatro cambios
3. Verificar cada uno en el navegador antes de continuar
4. Hacer commit con descripcion clara de lo que se cambio
5. Hacer push
6. Abrir Pull Request en GitHub con descripcion de todos los cambios
7. Notificar al desarrollador

Al final del dia: el desarrollador revisa en vivo y explica que miraria en cada Pull Request.

**Objetivo del Dia 5:** Salir con un cambio real aprobado y publicado en produccion.

---

## Referencia rapida

### Comandos del terminal

| Que quiero hacer | Comando |
|---|---|
| Entrar a la carpeta del proyecto | `cd project` |
| Instalar dependencias (solo primera vez) | `npm install` |
| Encender el sitio local | `npm run dev` |
| Apagar el sitio local | `Ctrl + C` |

### Flujo de cambios

```
Crear rama → Editar archivo → Guardar → Verificar → Commit → Push → Pull Request → Avisar
```

### Archivos de uso frecuente

| Quiero cambiar... | Archivo |
|---|---|
| Estadisticas (estudiantes, programas) | `project/src/data/staticData.ts` |
| Ano academico | `project/src/components/StatsSection.tsx` |
| Telefono/correo del footer | `project/src/components/Footer.tsx` |
| Telefono/extensiones/correos de contacto | `project/src/components/Contact.tsx` |
| Servicios destacados del inicio | `project/src/data/staticData.ts` |

---

## Reglas del equipo

1. Nunca trabajar directamente en la rama `master`
2. Nunca abrir ni modificar los archivos dentro de `src/auth/` ni `src/api/`
3. Nunca modificar `package.json`, `vite.config.ts` ni `tsconfig.json`
4. Siempre verificar el cambio en el navegador antes de hacer commit
5. Siempre escribir una descripcion clara en el commit y en el Pull Request
6. Nunca hacer merge sin aprobacion del desarrollador
7. Si tienes duda sobre si puedes tocar un archivo, pregunta primero

---

## Contacto con el desarrollador

Para solicitar revision de un Pull Request o reportar un problema tecnico, usa el canal acordado.

Incluye siempre:
- El numero o nombre del Pull Request
- Una descripcion breve de que cambiaste
- Una captura de pantalla si el cambio es visual
